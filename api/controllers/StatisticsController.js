module.exports = {
  trackPatch: async function (req, res) {
    const result = await StatisticsService.trackPatch(req.allParams())
    res.ok({ data: result })
  },

  findPatchStatistics: async function (req, res) {
    const result = await StatisticsService.findPatchStatistics(req.allParams())
    res.ok({ data: result })
  }
}
