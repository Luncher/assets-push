const Joi = require('joi')

module.exports = {
  trackPatch: Joi.object().keys({
    id: Joi.number().required(),
    message: Joi.string().optional().allow(''),
    state: Joi.string().valid(Object.keys(sails.config.app.patchStatisStatus))
  })
}
