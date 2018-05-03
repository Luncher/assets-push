const Joi = require('joi')

module.exports = {
  putLogs: Joi.object().keys({
    topic: Joi.string().required(),
    source: Joi.string().optional().allow(''),
    payload: Joi.array().items(Joi.object().keys({
      time: Joi.string().required(),
      level: Joi.string().required(),
      message: Joi.string().required()
    }))
  })
}
