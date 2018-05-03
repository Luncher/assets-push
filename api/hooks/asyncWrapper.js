const _ = require('lodash')

module.exports = (sails) => {
  return {
    initialize: (callback) => {
      _.each(sails.controllers, (controller, controllerId) => {
        _.each(controller, (_, actionId) => {
          actionId = actionId.toLowerCase()
          const action = sails.hooks.controllers.middleware[controllerId][actionId]
          sails.hooks.controllers.middleware[controllerId][actionId] = handleAction(action)
        })
      })

      callback()
    }
  }

  function handleAction (action) {
    return (req, res) => {
      try {
        Promise.resolve(action(req, res))
          .then(result => {
            return handleResult(result, req, res)
          })
          .catch(err => {
            return handleError(err, req, res)
          })
      } catch (err) {
        return handleError(err, req, res)
      }
    }
  }

  function handleResult (result, req, res) {
    if (res.headersSent || res.isHandled) return
    return res.ok(result)
  }

  function handleError (error, req, res) {
    if (res.headersSent || res.isHandled) return
    return res.negotiate(error)
  }
}
