const Joi = require('joi')

module.exports = {
  checkPatch: Joi.object().keys({
    channelId: Joi.number().required(),
    appVersion: Joi.string().required(),
    projectId: Joi.number().required(),
    patchVersion: Joi.string().optional().allow(''),
    os: Joi.string().valid(Object.keys(sails.config.app.platforms)).required()
  })
}
