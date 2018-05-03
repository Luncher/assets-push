module.exports = {
  tableName: 'user',
  attributes: {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: 'integer',
      columnName: 'pk_index'
    },
    username: {
      type: 'string',
      required: true,
      unique: true,
      size: 72,
      columnName: 'uk_name'
    },
    password: {
      type: 'string',
      required: true,
      columnName: 'password'
    },
    gender: {
      type: 'string',
      columnName: 'gender',
      enum: Object.keys(sails.config.app.genders),
      defaultsTo: Object.keys(sails.config.app.genders)[0]      
    },
    avatar: {
      type: 'text',
      columnName: 'avatar'
    },
    intro: {
      type: 'string',
      columnName: 'intro'
    }
  }
}
