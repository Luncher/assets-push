module.exports = {
  tableName: 'patch',
  attributes: {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: 'integer',
      columnName: 'pk_index'
    },
    version: {
      type: 'string',
      required: true,
      size: 32,
      columnName: 'version'
    },
    intro: {
      type: 'string',
      required: true,
      columnName: 'intro'
    },
    enable: {
      type: 'boolean',
      required: true,
      defaultsTo: false,
      columnName: 'enable'
    },
    action: {
      type: 'string',
      required: true,
      defaultsTo: 'OPTIONAL'
    },
    channels: {
      type: 'array',
      defaultsTo: [],
      columnName: 'channels'
    },
    patchFiles: {
      type: 'json',
      defaultsTo: [],
      columnName: 'patch_files'
    },
    patchMapFiles: {
      type: 'json',
      defaultsTo: [],
      columnName: 'patch_map_files'
    },
    diffPatchFiles: {
      type: 'json',
      defaultsTo: {},
      columnName: 'diff_patch_files'
    },
    appVersionId: {
      type: 'integer',
      required: true,
      columnName: 'app_version_id'
    }
  }
}
