module.exports = {
  tableName: 'application',
  attributes: {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: 'integer',
      columnName: 'pk_index'
    },
    os: {
      type: 'string',
      required: true,
      columnName: 'os',
      enum: Object.keys(sails.config.app.platforms),
      defaultsTo: Object.keys(sails.config.app.platforms)[0]
    },
    version: {
      type: 'string',
      required: true,
      columnName: 'version'
    },
    intro: {
      type: 'string',
      required: true,
      columnName: 'intro'
    },
    projectId: {
      type: 'integer',
      required: true,
      columnName: 'project_id'
    }
  }
}
