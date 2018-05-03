/**
 * 404 (Not Found) Handler
 */

module.exports = function notFound (data, options) {
  const res = this.res

  // Set status code
  res.status(404)

  sails.log.info('Sending 404 ("Not Found") response: \n', data || {})

  res.json({ code: -1, message: 'Not Found', data: data || {} })

  return
}