'use strict'

const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const publicPath = path.resolve(__dirname, './src/server')
const buildPath = path.resolve(__dirname, './src')
const postcssPath = path.resolve(__dirname, './src/client')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

process.noDeprecation = true

module.exports = {
  devtool: 'source-map',
  performance: {
    hints: false
  },
  watch: true,
  /* tells webpack to ignore built-in modules like path, fs, etc. */
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  context: publicPath,
  entry: {
    bundle: [
      'webpack/hot/poll?1000',
      './devServer'
    ]
  },
  output: {
    path: path.join(buildPath, 'build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  /* ignore all modules in node_modules folder except webpack/hot/poll */
  externals: [nodeExternals({
    whitelist: ['webpack/hot/poll?1000']
  })],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules|dist|build/,
        options: {
          plugins: [
            [
              'babel-plugin-react-css-modules',
              {
                context: postcssPath,
                filetypes: {
                  '.scss': 'postcss-scss'
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.local\.(css|scss)$/,
        use: [
          'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ]
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader'
      },
      {
        test: /\.(gif|png|jpg)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    /* this will clean build folder since using HMR creates new file on every change. Comment out to disable it. */
    new WebpackCleanupPlugin({
      exclude: ['bundle.js', 'bundle.js.map', 'index.html'],
      quiet: true
    }),
    new StartServerPlugin('bundle.js'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    /* We only use it for development to enable live reload */
    new HtmlWebpackPlugin({
      template: 'ejs-loader!./src/server/views/index.ejs'
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3003,
      ui: {
        port: 3002
      },
      proxy: 'http://localhost:3000/',
      codeSync: true,
      open: false,
      injectChanges: false,
      reloadOnRestart: true,
      logFileChanges: false,
      files: './src/build/bundle.js',
      watchOptions: {
        awaitWriteFinish: {
          /* if browser reloads before webpack updates the bundle file after change on the server, increase the time */
          stabilityThreshold: 1000
        }
      }
    },
    {
      reload: false
    })
  ]
}
