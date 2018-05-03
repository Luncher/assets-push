module.exports = {
  plugins: [
    require('postcss-partial-import'),
    require('postcss-url'),    
    require('precss'),
    require('postcss-cssnext')({
      browsers: ['ie > 8', 'last 2 versions']
    })
  ]
}