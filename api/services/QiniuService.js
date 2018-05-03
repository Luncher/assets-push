const path = require('path')
const qiniu = require('qiniu')

module.exports = {
  getToken: function () {
    const saveKey = '$(etag)'
    const scope = sails.config.app.qiniu.scope
    const accessKey = sails.config.app.qiniu.AccessKey
    const secretKey = sails.config.app.qiniu.SecretKey
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const putPolicy = new qiniu.rs.PutPolicy({ scope, saveKey })
    return putPolicy.uploadToken(mac)
  },

  getMD5: function ({ key }) {
    const publicUrl = this.resolvePublicUrl(key)
    sails.log.info(publicUrl + '?qhash/md5')
    return UtilService.getJSON(publicUrl + '?qhash/md5')
      .then(ret => ret && ret.hash)
  },

  resolvePublicUrl: function (path) {
    return sails.config.app.qiniu.publicHost + '/' + path
  },

  resolveDownloadDir: function (...subPaths) {
    const downloadDir = sails.config.app.qiniu.downloadDir
    return path.join(downloadDir, ...subPaths)
  },

  uploadStream: function (key, stream) {
    const token = this.getToken()
    const config = { useCdnDomain: true }
    const putExtra = new qiniu.form_up.PutExtra()
    const formUploader = new qiniu.form_up.FormUploader(config)
    return new Promise((resolve, reject) => {
      formUploader.putStream(token, key, stream, putExtra, (respErr, respBody, respInfo) => {
        if (respErr) {
          return reject(respErr)
        }
        resolve(respBody)
      })
    })
  },

  uploadFile: function (key, localFile) {
    const token = this.getToken()
    const config = { useCdnDomain: true }
    const putExtra = new qiniu.form_up.PutExtra()
    const formUploader = new qiniu.form_up.FormUploader(config)
    return new Promise((resolve, reject) => {
      formUploader.putFile(token, key, localFile, putExtra, (respErr, respBody, respInfo) => {
        if (respErr) {
          return reject(respErr)
        }
        switch (respInfo.statusCode) {
          case 200: {
            return resolve(respBody)
          }
          case 614: {
            return resolve({ key })
          }
          default: {
            return reject(respInfo)
          }
        }
      })
    })
  }
}
