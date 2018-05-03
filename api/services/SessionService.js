module.exports = {
  create: async function ({ username, password }) {
    const user = await sails.models.user.findOne({ username })
    if (!user) {
      throw sails.Error(ERROR_CODES.ERR_INVALID_LOGIN)
    }
    const exists = await UtilService.comparePassword(password, user.password)
    if (!exists) {
      throw sails.Error(ERROR_CODES.ERR_INVALID_PASSWORD)
    }
    return user
  },

  find: async function ({ uid }) {
    return sails.models.user.findOne({ id: uid })
  }
}
