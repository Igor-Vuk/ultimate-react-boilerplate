/* @flow */

import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { AppContainer } from 'react-hot-loader' // Automatically disabled in production

// import global styles 'bootstrap.scss' before 'routes' and local styles
import 'bootstrap/scss/bootstrap.scss'
import routes from './routes'

render(
  <AppContainer>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </AppContainer>,
  document.getElementById('app')
)

if (module.hot) {
  module.hot.accept('./routes', () => {
    const nextApp = require('./routes').default  // In JSX, lower-case tag names are considered to be HTML tags
    render(
      <AppContainer>
        <Router history={browserHistory}>
          <nextApp />
        </Router>
      </AppContainer>,
      document.getElementById('app')
    )
  })
}
