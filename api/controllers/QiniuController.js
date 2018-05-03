module.exports = {
  getToken: async function (req, res) {
    const token = await QiniuService.getToken()
    res.ok(token)
  },

  getMD5: async function (req, res) {
    const result = await QiniuService.getMD5(req.allParams())
    res.ok(result)
  }
}
