const path = require('path')
const fs = require('fs-extra')
const Walker = require('iwalk')
const md5File = require('md5-file')
const archiver = require('archiver')
const differenceBy = require('lodash.differenceby')

module.exports = {
  findByPage: async function (params) {
    const { pageSize = 10, pageNo = 0 } = params
    const condition = _.omit(params, ['pageNo', 'pageSize'])
    const totalNumber = await sails.models.patch.count(condition)
    const projects = await sails.models.patch.find({ where: condition, limit: pageSize, skip: pageNo * pageSize })
    return { list: projects, totalNumber }
  },

  isValidChannel: function (patch, channelId) {
    return !patch.channels.length || patch.channels.indexOf(channelId) !== -1
  },

  returnPatchByChannel: async function (patchs, channelId) {
    const latestPatch = patchs.find(patch => this.isValidChannel(patch, channelId))
    if (!latestPatch) {
      throw sails.Error(ERROR_CODES.ERR_NOT_FOUND_VALID_PATCH)
    }
    return {
      intro: latestPatch.intro,
      action: latestPatch.action,
      version: latestPatch.version,
      key: latestPatch.patchFiles[0].key,
      hash: latestPatch.patchFiles[0].hash,
      url: QiniuService.resolvePublicUrl(latestPatch.patchFiles[0].key)
    }
  },

  returnPatchByVersion: function (patchs, channelId, patchVersion) {
    const latestPatch = patchs.find(patch =>
      this.isValidChannel(patch, channelId) && patch.diffPatchFiles[`${patch.version}-${patchVersion}`])

    if (!latestPatch) {
      return this.returnPatchByChannel(patchs, channelId)
    }

    const diffPatchKey = `${latestPatch.version}-${patchVersion}`
    const diffPatch = latestPatch.diffPatchFiles[diffPatchKey]
    return {
      key: diffPatch.key,
      hash: diffPatch.hash,
      action: latestPatch.action,
      version: latestPatch.version,
      intro: latestPatch.intro,
      url: QiniuService.resolvePublicUrl(diffPatch.key)
    }
  },

  checkPatch: async function (params) {
    const channelId = parseInt(params.channelId, 10)
    const appInfo = await sails.models.application.findOne({
      os: params.os,
      version: params.appVersion,
      projectId: params.projectId
    })
    if (!appInfo) {
      throw sails.Error(ERROR_CODES.ERR_NOT_FOUND_APP_VERSION)
    }
    const patchs = await sails.models.patch.find({
      where: {
        enable: true,
        appVersionId: appInfo.id
      },
      sort: 'version DESC'
    })

    if (!params.patchVersion) {
      return this.returnPatchByChannel(patchs, channelId)
    } else {
      return this.returnPatchByVersion(patchs, channelId, params.patchVersion)
    }
  },

  downloadPatch: async function (patch) {
    const key = patch.patchFiles[0].key
    const patchZipUrl = QiniuService.resolvePublicUrl(key)
    const downloadPath = QiniuService.resolveDownloadDir(key)
    sails.log.info('patchZipUrl: ', patchZipUrl)
    sails.log.info('downloadPath: ', downloadPath)
    if (fs.existsSync(downloadPath)) {
      fs.unlinkSync(downloadPath)
    }
    await UtilService.download(patchZipUrl, downloadPath)

    return downloadPath
  },

  uploadPatchDiff: async function (key, pathDiffDir) {
    const res = await QiniuService.uploadFile(key, pathDiffDir)
    res.hash = await QiniuService.getMD5({ key })

    return res
  },

  doPatchDiff: async function (patchDir, oldPatchDir, diffPatchKey, diffPatchDir) {
    return new Promise((resolve, reject) => {
      const walker = new Walker()
      const output = fs.createWriteStream(diffPatchDir)
      const archive = archiver('zip', {
        zlib: { level: 9 }
      })
      archive.pipe(output)
      walker.on('error', reject)
      archive.on('error', reject)
      archive.on('warning', reject)
      output.on('close', () => {
        this.uploadPatchDiff(diffPatchKey, diffPatchDir)
          .then(res => resolve(res))
          .catch(reject)
      })
      walker.on('end', () => {
        archive.finalize()
      })
      walker.walk(patchDir, (filePath, isDirectory) => {
        if (isDirectory) return
        const subFilePath = path.relative(patchDir, filePath)
        const oldFilePath = path.join(oldPatchDir, subFilePath)
        if (!fs.existsSync(oldFilePath)) {
          archive.append(fs.createReadStream(filePath), { name: subFilePath })
        } else {
          const newFileMD5 = md5File.sync(filePath)
          const oldFileMD5 = md5File.sync(oldFilePath)
          if (newFileMD5 !== oldFileMD5) {
            archive.append(fs.createReadStream(filePath), { name: subFilePath })
          }
        }
      })
    })
  },

  matchPatchDiff: async function (patch, patchZipDir, oldPatch, oldPatchZipDir) {
    const patchZipName = path.basename(patchZipDir).split('.')[0]
    const oldPatchZipName = path.basename(oldPatchZipDir).split('.')[0]
    const patchDir = path.join(path.dirname(patchZipDir), patchZipName + '-dir')
    const oldPatchDir = path.join(path.dirname(oldPatchZipDir), oldPatchZipName + '-dir')

    await UtilService.unzip(patchZipDir, patchDir)
    await UtilService.unzip(oldPatchZipDir, oldPatchDir)

    const key = `${patchZipName}-${oldPatchZipName}`
    const diffPatchDir = QiniuService.resolveDownloadDir(key)

    sails.log.info('diffPatchDir', diffPatchDir)

    return this.doPatchDiff(patchDir, oldPatchDir, key, diffPatchDir)
  },

  matchPatchDiffs: async function (patch, oldPatchs) {
    const diffMap = {}
    const patchZipDir = await this.downloadPatch(patch)
    for (let oldPatch of oldPatchs) {
      const id = `${patch.version}-${oldPatch.version}`
      const oldPatchZipDir = await this.downloadPatch(oldPatch)
      diffMap[id] = await this.matchPatchDiff(patch, patchZipDir, oldPatch, oldPatchZipDir)
    }

    return diffMap
  },

  createPatchDiffs: async function (patch) {
    const condition = { appVersionId: patch.appVersionId, version: { '<': patch.version } }
    const oldPatchs = await sails.models.patch.find({ where: condition })

    if (oldPatchs.length) {
      const diffPatchFiles = await this.matchPatchDiffs(patch, oldPatchs)
      return sails.models.patch.update({ id: patch.id }, { diffPatchFiles })
    }

    return patch
  },

  create: async function (params) {
    const patch = await sails.models.patch.create(params)
    return this.createPatchDiffs(patch)
  },

  updatePatch: async function (params) {
    const [ patch ] = await sails.models.patch.update({ id: params.id }, params)
    if (params.patchFiles && params.patchFiles.length && differenceBy(params.patchFiles, patch.patchFiles, 'hash').length > 0) {
      return this.createPatchDiffs(patch)
    }

    return patch
  }
}
