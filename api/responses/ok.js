/**
 * 200 (OK) Response
 */

const util = require('util')

module.exports = function sendOK (data, options) {
  const req = this.req
  const res = this.res
  const sails = req._sails

  if (typeof data !== 'object') {
    data = { data }
  }

  const result = {}
  if (data.code == 0 || !data.code) {
    result.code = ERROR_CODES.ERR_OK
    result.message = ERROR_PAYLOADS[ERROR_CODES.ERR_OK].message
  } else {
    result.code = data.code || ERROR_CODES.ERR_FAILURE
    result.message = data.errorMessage || ERROR_PAYLOADS[ERROR_CODES.ERR_FAILURE].message
  }
  result.data = data.data || data
  res.status(data.status ? data.status : 200)

  sails.log.info(`${req.method} ${req.url} Result: ${util.inspect(result)}`);

  return res.json(result)
}
