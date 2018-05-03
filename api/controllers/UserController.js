module.exports = {
  create: async function (req, res) {
    const user = await UserService.create(req.allParams())
    return res.ok(user)
  },

  update: async function (req, res) {
    const result = await UserService.update(req.allParams())
    res.ok(result)
  },

  find: async function (req, res) {
    const users = await UserService.find(req.allParams())
    res.ok({ data: users })
  }
}
