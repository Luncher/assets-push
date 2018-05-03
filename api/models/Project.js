module.exports = {
  tableName: 'project',
  attributes: {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: 'integer',
      columnName: 'pk_index'
    },
    name: {
      type: 'string',
      required: true,
      unique: true,
      size: 64,
      columnName: 'uk_name'
    },
    intro: {
      type: 'string',
      required: true,
      columnName: 'intro'
    }
    // accessKey: {
    //   type: 'string',
    //   required: true,
    //   columnName: 'access_key'
    // },
    // secretKey: {
    //   type: 'string',
    //   required: true,
    //   columnName: 'secret_key'
    // }
  }
}
