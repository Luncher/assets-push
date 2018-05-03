module.exports = {
  trackPatch: async function (params) {
    await sails.models.statistics.update({ id: params.id }, params)
    return
  },

  findPatchStatistics: async function (params) {
    const list = await sails.models.statistics.find({ where: params })
    const groupBy = _.groupBy(list, 'patchVersion')
    const statis = Object.keys(groupBy).map(it => {
      const count = groupBy[it].length
      const complete = groupBy[it].filter(it => it.state === 'COMPLETE').length
      return {
        patchVersion: it,
        downloadCount: count,
        downloadComplete: complete,
        successRate: count > 0 ? (complete / count) : 0
      }
    })
    return { list: statis, totalNumber: statis.length }
  }
}
