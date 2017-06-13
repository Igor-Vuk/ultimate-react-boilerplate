'use strict'

const path = require('path')
const webpack = require('webpack')
const publicPath = path.resolve(__dirname, './src/client')
const buildPath = path.resolve(__dirname, './src')
/* const BrowserSyncPlugin = require('browser-sync-webpack-plugin') */
/* const Write = require('write-file-webpack-plugin') */

process.noDeprecation = true

module.exports = {
  devtool: 'source-maps',
  performance: {
    hints: false
  },
  /* To use server instead of proxy. To use Browsersync for mobile testing, use proxy. */
  // devServer: {
  //   hot: true,
  //   port: 3001,
  //   host: 'localhost',
  //   headers: { 'Access-Control-Allow-Origin': '*' },
  //   historyApiFallback: true
  // },
  devServer: {
    hot: true,
    port: 3001,
    host: 'localhost',
    /* Needed only if using Browsersync */
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy: {
      '**': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true
      }
    }
  },
  context: publicPath,
  entry: {
    bundle: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3001',
      'webpack/hot/only-dev-server',
      'script-loader!jquery/dist/jquery.min.js',
      'script-loader!tether/dist/js/tether.min.js',
      'script-loader!bootstrap/dist/js/bootstrap.min.js',
      './app.js'
    ]
  },
  output: {
    path: path.join(buildPath, 'dist'),
    filename: '[name].js',
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
              resources: [
                /* uncomment for import of Bootstrap variables and mixins */
                // path.resolve(__dirname, './node_modules/bootstrap/scss/_variables.scss'),
                // path.resolve(__dirname, './node_modules/bootstrap/scss/_mixins.scss'),
                path.resolve(__dirname, './src/client/styles/scss/variables.scss')
              ]
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
      },
      {
        test: /\.(gif|png|jpg)$/,
        // We can specify custom publicPath if needed
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    /* Uncoment if you wish to write on disc instead of memory */
    // new Write(),
    new webpack.NamedModulesPlugin(),
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
    })
    /* For Mobile and other device testing use port: 3005(external port offered by Browsersync). React-hot-reload is disabled becuase it would not work on other devices. All the changes made on client and server side will live reload on all devices. State will not be preserved. To use, uncoment this, Browsersync require at the top of the page and Access-Control-Allow-Origin inside dev-server proxy */
    // new BrowserSyncPlugin({
    //   host: 'localhost',
    //   port: 3005,
    //   ui: {
    //     port: 3004
    //   },
    //   proxy: {
    //     target: 'http://localhost:3001/'
    //   },
    //   codeSync: true,
    //   open: false,
    //   injectChanges: false,
    //   reloadOnRestart: true,
    //   files: './src/build/bundle.js',
    //   watchOptions: {
    //     awaitWriteFinish: {
    //       /* if browser reloads before webpack updates the bundle file after change on the server, increase the time */
    //       stabilityThreshold: 1000
    //     }
    //   }
    // })
  ]
}
