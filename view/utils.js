import dateFormat from 'dateformat'
import * as qiniu from 'qiniu-js'

export function normalizeDate (src) {
  return dateFormat(src, 'yyyy-mm-dd HH:MM:ss')
}

export function uploadQiniuFile (token, subDir, file, onComplete, onStep) {
  const config = {}
  const putExtra = {}
  // const key = `${process.env.NODE_ENV}/${subDir}/${file.name}`
  // console.log('qiniu upload key: ', key)
  const observable = qiniu.upload(file, null, token, putExtra, config)
  observable.subscribe(function next (res) {
    onStep && onStep(null, res)
  }, function error (err) {
    onComplete(err)
  }, function complete (res) {
    onComplete(null, res)
  })
}
