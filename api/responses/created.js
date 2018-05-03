/**
 * 201 (CREATED) Response
 */

module.exports = function created (data, options) {
  const res = this.res
  data.status = 201
  res.ok(data, options)
}
