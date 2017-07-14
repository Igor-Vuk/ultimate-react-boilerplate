'use strict'

const path = require('path')
const publicPath = path.resolve(__dirname, './src/server')
const buildPath = path.resolve(__dirname, './src')
const postcssPath = path.resolve(__dirname, './src/client')
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  performance: {
    hints: false
  },
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  context: publicPath,
  entry: {
    bundle: './prodHerokuServer.js'
  },
  output: {
    path: path.join(buildPath, 'build'),
    filename: '[name].js'
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
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules|dist|build/,
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
        test: /\.(gif|png|jpg)$/,
        loader: 'url-loader?limit=25000&emitFile=false&name=assets/[name].[hash].[ext]'
      }
    ]
  },
  plugins: [
    /* copy ejs template to build/views folder */
    new CopyWebpackPlugin([
      {from: 'views', to: 'views/index.ejs'}
    ])
  ]
}
