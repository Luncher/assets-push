const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const context = path.dirname(__dirname)
const resolve = dir => path.resolve(__dirname, dir)
const isProd = process.env.NODE_ENV === 'production'

chalk.enable = true
module.exports = {
  context,
  devtool: isProd ? false : '#source-map',
  output: {
    publicPath: '/',
    filename: '[name].[chunkhash].js',
    path: resolve('../assets/')
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'components': resolve('../view/components/'),
      'pages': resolve('../view/pages/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(vue|js)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: vueConfig
          },
          {
            loader: 'iview-loader',
            options: {
              prefix: false
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.css$/,
        loader: isProd
          ? ExtractTextPlugin.extract({
            use: 'css-loader?minimize&importLoaders=1!postcss-loader',            
            fallback: 'style-loader'
          })
          : [
            'vue-style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd
    ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      }),
      new ExtractTextPlugin({
        filename: 'common.[chunkhash].css'
      })
    ]
    : [
      new FriendlyErrorsPlugin()
    ]
}