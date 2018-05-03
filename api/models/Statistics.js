module.exports = {
  tableName: 'statistics',
  attributes: {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: 'integer',
      columnName: 'pk_index'
    },
    projectId: {
      type: 'integer',
      index: true,
      required: true,
      columnName: 'project_id'
    },
    appVersion: {
      size: 32,
      index: true,
      required: true,
      type: 'string',
      columnName: 'app_version'
    },
    patchVersion: {
      size: 32,
      index: true,
      required: true,
      type: 'string',
      columnName: 'patch_version'
    },
    devId: {
      type: 'string',
      required: true,
      columnName: 'dev_id'
    },
    os: {
      size: 16,
      type: 'string',
      required: true,
      index: true,
      columnName: 'os',
      enum: Object.keys(sails.config.app.platforms)
    },
    brand: {
      type: 'string',
      required: true,
      columnName: 'brand'
    },
    channelId: {
      type: 'string',
      required: true,
      columnName: 'channel_id'
    },
    state: {
      type: 'string',
      required: true,
      columnName: 'status',
      defaultsTo: sails.config.app.patchStatisStatus.BEGIN
    },
    message: {
      type: 'string',
      columnName: 'message'
    }
  }
}
