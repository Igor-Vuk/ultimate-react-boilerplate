'use strict'

const path = require('path')
const webpack = require('webpack')
const publicPath = path.resolve(__dirname, './src/client')
const buildPath = path.resolve(__dirname, './src')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const WebpackMd5Hash = require('webpack-md5-hash')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ExtractLocal = new ExtractTextPlugin({filename: 'stylesheet/stylesLocal.[contenthash].local.css', disable: false, allChunks: true})
const ExtractGlobal = new ExtractTextPlugin({filename: 'stylesheet/stylesGlobal.[contenthash].css', disable: false, allChunks: true})

module.exports = {
  devtool: 'source-maps',
  performance: {
    hints: false
  },
  context: publicPath,
  entry: {
    bundle: [
      'script-loader!jquery/dist/jquery.min.js',
      'script-loader!tether/dist/js/tether.min.js',
      'script-loader!bootstrap/dist/js/bootstrap.min.js',
      './app.js'
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router'
    ]
  },
  output: {
    path: path.join(buildPath, 'dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: 'http://localhost:3001/'
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
        exclude: /node_modules|dist|build/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            'react',
            ['es2015', { 'modules': false }],
            'stage-0'
          ],
          plugins: [
            'transform-runtime',
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
        use: ExtractLocal.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
            'postcss-loader',
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  path.resolve(__dirname, './src/client/styles/scss/variables.scss')
                ]
              }
            }
          ]
        })
      },
      {
        test: /^((?!\.local).)+\.(css|scss)$/,
        use: ExtractGlobal.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        })
      },
      {
        test: /\.(gif|png|jpg)$/,
        loader: 'url-loader?limit=25000&name=assets/[name].[ext]'
      }
    ]
  },
  plugins: [
    ExtractLocal,
    ExtractGlobal,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    /* For long term caching. Changing the bundle doesn't change vendor hash */
    new WebpackMd5Hash(),
    /* Inside manifest.json both localStyles and gloablStyles are generated under same key bundle.css/.map so they overwrite each other. We must change the key name of one of them. */
    new WebpackAssetsManifest({
      customize: (key, value) => {
        if (value.toLowerCase().endsWith('.local.css')) {
          return {
            key: 'localcss.css',
            value: value
          }
        }
        if (value.toLowerCase().endsWith('.local.css.map')) {
          return {
            key: 'localcss.css.map',
            value: value
          }
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
