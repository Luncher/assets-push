module.exports = {
  putLogs: async function (req, res) {
    const result = await LogService.putLogs(req.allParams())
    res.ok(result)
  }
}
