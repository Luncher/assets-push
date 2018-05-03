module.exports = {
  findByPage: async function (req, res) {
    const result = await PatchService.findByPage(req.allParams())
    res.ok(result)
  },

  checkPatch: async function (req, res) {
    const result = await PatchService.checkPatch(req.allParams())
    res.ok(result)
  },

  create: async function (req, res) {
    const result = await PatchService.create(req.allParams())
    res.ok(result)
  },

  updatePatch: async function (req, res) {
    const result = await PatchService.updatePatch(req.allParams())
    res.ok(result)
  }
}
