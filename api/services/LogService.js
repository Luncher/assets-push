const Aliyun = require('aliyun-sdk')

class LogService {
  constructor (config) {
    this.projectName = config.projectName
    this.logStoreName = config.logStoreName
    this.sls = new Aliyun.SLS({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      endpoint: config.endpoint,
      apiVersion: '2015-06-01',
      httpOptions: {
        timeout: 10000
      }
    })
  }

  sanitizeLogGroup ({ topic, source, payload }) {
    const logs = payload.map(item => {
      return {
        time: Math.floor(new Date().getTime() / 1000),
        contents: Object.keys(item).map(key => ({
          key: key,
          value: JSON.stringify(item[key])
        }))
      }
    })
    return { logs, topic, source: '127.0.0.1' }
  }

  putLogs (params) {
    const logGroup = this.sanitizeLogGroup(params)
    return new Promise((resolve, reject) => {
      this.sls.putLogs({
        logGroup,
        projectName: this.projectName,
        logStoreName: this.logStoreName
      }, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}

module.exports = new LogService(sails.config.slsConfig)
