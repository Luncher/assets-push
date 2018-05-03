module.exports = function (req, res, next) {
  if (!req.session.uid && req.url !== '/signin') {
    if (req.wantsJSON) {
      res.serverError(sails.Error(ERROR_CODES.ERR_NEED_LOGIN))
    } else {
      res.redirect(sails.config.app.redirectUrls.signin)
    }
  } else {
    next()
  }
}
