'use strict'

const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const clientConfig = require('./webpack.client.config')

const clientManifestPath = path.join(clientConfig.output.path, 'vue-ssr-client-manifest.json')
const serverBundlePath = path.join(clientConfig.output.path, 'vue-ssr-server-bundle.json')

let bundle = fs.readFileSync(serverBundlePath, 'utf8')
let clientManifest = fs.readFileSync(clientManifestPath, 'utf8')

function update () {
  if (bundle && clientManifest) {
    sails.log.info('renderer updated.')
    global.renderer = global.createRenderer(JSON.parse(bundle), { clientManifest: JSON.parse(clientManifest) })
  }
}

chokidar.watch(clientManifestPath).on('change', () => {
  clientManifest = fs.readFileSync(clientManifestPath, 'utf8')
  sails.log.info('clientManifest updated.')
  update()
})

chokidar.watch(serverBundlePath).on('change', () => {
  bundle = fs.readFileSync(serverBundlePath, 'utf8')
  sails.log.info('serverBundle updated.')
  update()
})
