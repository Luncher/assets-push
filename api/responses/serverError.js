/**
 * 500 (Server Error) Response
 */

const util = require('util')

module.exports = function serverError (data, options) {
  const res = this.res
  const req = this.req

  sails.log.error(`${req.method} ${req.url} Result: ${util.inspect(data)}`)

  if (data instanceof VError) {
    const info = VError.info(data)
    const cause = VError.cause(data)
    const message = info.message + ':' + (cause ? cause.message : '')
    res.status(info.status)
    res.json({ code: info.code, message, data: info.data || {} })
  } else if (data instanceof Error) {
    res.status(500)
    res.json({ code: -1, message: data.message, data: {} })
  } else {
    res.status(data.status || 500)
    res.json({ code: -1, message: data.message, data: {} })
  }

  return
}
