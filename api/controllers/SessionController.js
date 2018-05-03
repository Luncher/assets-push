module.exports = {
  create: async function (req, res) {
    const params = req.allParams()
    const user = await SessionService.create(params)
    sails.log.info('login: ', user)
    sails.log.info('uid: ', req.session.uid)
    req.session.uid = user.id
    return res.ok({ data: user })
  },

  destroy: async function (req, res) {
    req.session.uid = null
    return res.ok()
  },

  find: async function (req, res) {
    const uid = req.session.uid
    const userInfo = await SessionService.find({ uid })
    res.ok(userInfo)
  }
}
