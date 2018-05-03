const Joi = require('joi')
const schemas = require('../schemas')

module.exports = (sails) => ({
  initialize: callback => {
    Object.keys(sails.controllers).forEach(key => {
      wrapAction(sails.controllers[key])
    })
    callback()
  }
})

function wrapAction (controller) {
  const id = controller.identity
  Object.keys(controller).forEach(key => {
    if (schemas && schemas[id] && schemas[id][key]) {
      const action = sails.hooks.controllers.middleware[id][key.toLowerCase()]
      sails.hooks.controllers.middleware[id][key.toLowerCase()] =
        validateAction(action, schemas[id][key])
    }
  })
}

function validateAction (action, schema) {
  return (req, res) => {
    const params = req.allParams()
    const { error } = Joi.validate(params, schema, { allowUnknown: true })
    if (error != null) {
      return res.negotiate(sails.Error(ERROR_CODES.ERR_INVALID_PARAMS, error))
    }
    return action(req, res)
  }
}
