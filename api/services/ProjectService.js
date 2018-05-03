module.exports = {
  findByPage: async function (params) {
    const { pageSize = 10, pageNo = 0 } = params
    const condition = _.omit(params, ['pageNo', 'pageSize'])
    const totalNumber = await sails.models.project.count(condition)
    const projects = await sails.models.project.find({ where: condition, limit: pageSize, skip: pageNo * pageSize })
    return { list: projects, totalNumber }
  },

  loadChannels: async function (params) {
    const channels = await UtilService.getJSON(sails.config.app.channelURL)
    channels.unshift({ id: sails.config.app.isoChannel, name: '苹果' })
    return channels
  }
}
