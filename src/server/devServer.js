/* @flow */

import http from 'http'
import app from './devServerUtils'
import conf from './conf'

const PORT: number = conf.APP_PORT

const server = http.createServer(app)
let currentApp = app

// $FlowFixMe
server.listen(PORT, () => {
  console.log(`
  Express server is up on port ${PORT}
  Development environment - Webpack HMR active
  Browsersync active
  `)
})

if (module.hot) {
  module.hot.accept('./devServer', () => {
    server.removeListener('request', currentApp)
    currentApp = app
    server.on('request', app)
  })
}
