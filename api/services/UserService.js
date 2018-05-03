module.exports = {
  sentizePassword: async function (profile) {
    if (profile.password) {
      if (profile.password.length < 8) {
        throw sails.Error(ERROR_CODES.ERR_PASSWORD_TOO_SHORT)
      }
      profile.password = await UtilService.bcryptPassword(profile.password)
    }
    return profile
  },

  sentizeAvatar: function (profile) {
    if (!profile.avatar && profile.username) {
      profile.avatar = UtilService.genAvatar(profile.username)
    }
    return profile
  },

  sentizeProfile: async function (profile) {
    await this.sentizeAvatar(profile)
    await this.sentizePassword(profile)

    return profile
  },

  update: async function (params) {
    const id = params.id
    const profile = await this.sentizeProfile(params)
    return sails.models.user.update({ id }, profile)
  },

  create: async function (params) {
    const profile = await this.sentizeProfile(params)
    try {
      return await sails.models.user.create(profile)
    } catch (err) {
      throw sails.Error(ERROR_CODES.ERR_SIGNUP, err)
    }
  },

  find: async function (params) {
    const { pageSize = 10, pageNo = 0 } = params
    const condition = _.omit(params, ['pageNo', 'pageSize'])
    const totalNumber = await sails.models.user.count(condition)
    const users = await sails.models.user.find({ where: condition, limit: pageSize, skip: pageNo * pageSize })
    return { list: users, totalNumber }
  }
}
