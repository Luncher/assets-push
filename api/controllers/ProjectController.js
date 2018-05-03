module.exports = {
  findByPage: async function (req, res) {
    const result = await ProjectService.findByPage(req.allParams())
    res.ok(result)
  },

  loadChannels: async function (req, res) {
    const result = await ProjectService.loadChannels(req.allParams())
    res.ok(result)
  }
}
