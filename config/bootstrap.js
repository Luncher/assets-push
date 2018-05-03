const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const serialize = require('serialize-javascript')
const { createBundleRenderer } = require('vue-server-renderer')

const resolve = file => path.resolve(__dirname, file)
const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const template = fs.readFileSync(resolve('../view/index.html'), 'utf8')

function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    template,
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    runInNewContext: false
  }))
}

module.exports.bootstrap = function (cb) {
  global.VError = require('verror')
  global.ERROR_CODES = sails.config.app.ERROR_CODES
  global.ERROR_PAYLOADS = sails.config.app.ERROR_PAYLOADS
  sails.Error = UtilService.createError

  if (isTest) {
    return cb()
  }
  const bundle = require('../assets/vue-ssr-server-bundle.json')
  const clientManifest = require('../assets/vue-ssr-client-manifest.json')
  const renderer = createRenderer(bundle, {
    clientManifest
  })

  if (sails.config.setupDevServer) {
    sails.log.info('setup-dev-server')
    require('../build/setup-dev-server')
  }

  global.renderer = renderer
  global.serialize = serialize
  global.createRenderer = createRenderer

  cb()
}
