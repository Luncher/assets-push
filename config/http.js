/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/

    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'myRequestLogger',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      'checkRedirect',
      'serverRenderer',
      '500'
    ],

    bodyParser: require('skipper')({strict: true}),

    myRequestLogger: function (req, res, next) {
      sails.log.info('Requested :: ', req.method, req.url)
      return next()
    },

    checkRedirect: function (req, res, next) {
      if (!req.session.uid && req.url !== '/signin') {
        if (req.wantsJSON) {
          res.serverError(sails.Error(ERROR_CODES.ERR_NEED_LOGIN))
        } else {
          res.redirect(sails.config.app.redirectUrls.signin)
        }
      } else if (req.url === '/signin' && req.session.uid) {
        res.redirect(sails.config.app.redirectUrls.projects)
      } else {
        next()
      }
    },

    serverRenderer: function (req, res, next) {
      if (!global.renderer) {
        return res.end('waiting for compilation... refresh wait in a moment')
      }

      res.header('Content-Type', 'text/html')

      const s = Date.now()
      const context = {
        url: req.url,
        cookies: req.headers.cookie
      }
      sails.log.info('render context:', context)

      const renderStream = global.renderer.renderToStream(context)

      renderStream.on('data', chunk => {
        res.write(chunk)
      })

      renderStream.on('end', () => {
        sails.log.info(`whole request: ${Date.now() - s}ms`)
        res.end()
      })

      renderStream.on('error', err => {
        if (err && err.code === 404) {
          return res.status(404).end('404 | Page Not Found')
        }
        res.status(500).end('Internal Error 500')
        sails.log.error(`error during render : ${req.url}`)
        sails.log.error(err)
      })

      return
    }
  }
}
