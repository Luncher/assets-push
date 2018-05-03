const path = require('path')
const fs = require('fs-extra')
const axios = require('axios')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const unzip = require('unzip-stream')
const Identicon = require('identicon.js')
const DiffPatch = require('../common/diff_match_patch_uncompressed.js')

module.exports = {
  bcryptPassword: async function (password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
  },

  comparePassword: async function (password, hash) {
    return bcrypt.compare(password, hash)
  },

  createError: function (code, cause) {
    const payload = ERROR_PAYLOADS[code]
    const name = payload.name
    const info = payload
    info.code = code
    return new VError({ name, info, cause })
  },

  genAvatar: function (identify) {
    const hash = crypto.createHash('md5')
    hash.update(identify)
    const imgData = new Identicon(hash.digest('hex')).toString()
    return 'data:image/png;base64,' + imgData
  },

  getJSON: function (url, params = {}) {
    return axios({
      url,
      method: 'GET',
      params
    })
      .then(res => res.data)
  },

  getStream: function (url) {
    return axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
      .then(res => res.data)
  },

  download: function (url, destPath) {
    fs.ensureDirSync(path.dirname(destPath))
    return new Promise((resolve, reject) => {
      this.getStream(url)
        .then(stream => {
          const write = fs.createWriteStream(destPath)
          write.on('error', reject)
          write.on('close', resolve)
          stream.pipe(write)
        })
        .catch(reject)
    })
  },

  unzip: function (zipPath, dirPath) {
    return new Promise((resolve, reject) => {
      const extract = unzip.Extract({ path: dirPath })
      extract.on('error', reject)
      extract.on('close', resolve)
      fs.createReadStream(zipPath).pipe(extract)
    })
  },

  matchDiffPatch: function (oldFileContent, newFileContent) {
    const differ = new DiffPatch()
    return differ.patch_make(oldFileContent, newFileContent)
  }
}
