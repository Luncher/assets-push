module.exports = async function (req, res, next) {
  const params = req.allParams()
  const patch = await sails.models.patch.findOne(params.id)
  if (!patch) {
    return next(sails.Error(ERROR_CODES.ERR_NOT_FOUND))
  }

  return next()
}
