/**
 * 403 (Forbidden) Handler
 */

module.exports = function forbidden (data, options) {
  const res = this.res

  // Set status code
  res.status(403)

  sails.log.info('Sending 403 ("Forbidden") response: \n', data || {})

  res.json({ code: -1, message: 'Forbidden', data: {} })
}
