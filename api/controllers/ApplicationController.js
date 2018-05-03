module.exports = {
  findByPage: async function (req, res) {
    const result = await ApplicationService.findByPage(req.allParams())
    res.ok(result)
  }
}
