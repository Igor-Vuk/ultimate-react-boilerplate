'use strict'

import path from 'path'
import webpack from 'webpack'
import BrowserSyncPlugin from 'browser-sync-webpack-plugin'
const publicPath = path.resolve(__dirname, './src/client')
const buildPath = path.resolve(__dirname, './src')

process.noDeprecation = true

module.exports = {
  devtool: 'eval-source-map',
  performance: {
    hints: false
  },
  context: publicPath,
  entry: {
    bundle: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=false&noInfo=true',
      'script-loader!jquery/dist/jquery.min.js',
      'script-loader!tether/dist/js/tether.min.js',
      'script-loader!bootstrap/dist/js/bootstrap.min.js',
      './app.js'
    ]
  },
  output: {
    path: path.join(buildPath, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      FormComponent: path.resolve(__dirname, 'src/client/scenes/feature/components/FormComponent.jsx'),
      Feature: path.resolve(__dirname, 'src/client/scenes/feature/index.jsx'),
      TitleComponent: path.resolve(__dirname, 'src/client/scenes/home/components/TitleComponent.jsx'),
      Home: path.resolve(__dirname, 'src/client/scenes/home/index.jsx'),
      Navigation: path.resolve(__dirname, 'src/client/scenes/shared/navigation/index.jsx'),
      Container: path.resolve(__dirname, 'src/client/scenes/Container.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules|dist/,
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              'babel-plugin-react-css-modules',
              {
                context: publicPath,
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
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'postcss-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, './src/client/styles/global/sass-resources.scss')
            }
          }
        ]
      },
      {
        test: /^((?!\.local).)+\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    /* For Browser. Browsersync will not send any file-change events to browser. Hot reload is active. */
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3002,
      ui: {
        port: 3001
      },
      proxy: 'http://localhost:3000/',
      codeSync: false,
      open: false,
      reload: false,
      injectChanges: false
    }),
    /* For Mobile. Browsersync will refresh the page on every change instead of hot reload */
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3004,
      ui: {
        port: 3003
      },
      proxy: 'http://localhost:3000/',
      codeSync: true,
      open: false,
      injectChanges: false
    })
  ]
}
