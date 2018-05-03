/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /ping': 'HealthController.ping',
  'POST /api/sessions': 'SessionController.create',
  'DELETE /api/sessions': 'SessionController.destroy',
  'GET /api/sessions': 'SessionController.find',
  'POST /api/users': 'UserController.create',
  'GET /api/users': 'UserController.find',
  'PATCH /api/users/:id': 'UserController.update',

  'GET /api/projects': 'ProjectController.findByPage',
  'GET /api/projects/channels': 'ProjectController.loadChannels',
  'GET /api/projects/:id': 'ProjectController.findOne',
  'DELETE /api/projects/:id': 'ProjectController.destroy',
  'PATCH /api/projects/:id': 'ProjectController.update',
  'POST /api/projects': 'ProjectController.create',

  'GET /api/applications': 'ApplicationController.findByPage',
  'DELETE /api/applications/:id': { model: 'application', blueprint: 'destroy' },
  'PATCH /api/applications/:id': { model: 'application', blueprint: 'update' },
  'POST /api/applications': { model: 'application', blueprint: 'create' },

  'GET /api/patchs': 'PatchController.findByPage',
  'GET /api/patchs/check': 'PatchController.checkPatch',
  'DELETE /api/patchs/:id': { model: 'patch', blueprint: 'destroy' },
  'PATCH /api/patchs/:id': 'PatchController.updatePatch',
  'POST /api/patchs': 'PatchController.create',

  'GET /api/qiniu/token': 'QiniuController.getToken',
  'GET /api/qiniu/md5': 'QiniuController.getMD5',

  'POST /api/statistics/patchs': 'StatisticsController.create',
  'PATCH /api/statistics/patchs/:id': 'StatisticsController.trackPatch',
  'GET /api/statistics/patchs': 'StatisticsController.findPatchStatistics',

  'POST /api/logs': 'LogController.putLogs'
}
