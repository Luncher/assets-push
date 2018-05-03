[
  'log',
  'statistics',
  'patchversion'
].forEach(it => {
  module.exports[it] = require(`./${it}`)
})
