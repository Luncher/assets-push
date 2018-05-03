/**
 * 400 (Bad Request) Handler
 */

module.exports = function badRequest (data, options) {
  // Get access to `req`, `res`, & `sails`
  var req = this.req
  var res = this.res
  var sails = req._sails

  // Set status code
  res.status(400)

  sails.log.info('Sending 400 ("Bad Request") response: \n', data || {})
  const code = ERROR_CODES.ERR_INVALID_PARAMS
  res.json({ code: code, message: ERROR_PAYLOADS[code].message, data })

  return
}
