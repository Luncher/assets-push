module.exports = {
  findByPage: async function (params) {
    const { pageSize = 10, pageNo = 0 } = params
    const condition = _.omit(params, ['pageNo', 'pageSize'])
    const totalNumber = await sails.models.application.count(condition)
    const projects = await sails.models.application.find({ where: condition, limit: pageSize, skip: pageNo * pageSize })
    return { list: projects, totalNumber }
  }
}
