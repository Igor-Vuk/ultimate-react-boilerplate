/* @flow */

import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'

// import global styles 'bootstrap.scss' before 'routes' and local styles
import 'bootstrap/scss/bootstrap.scss'
import routes from './routes'

render(
  <Router history={browserHistory}>
    {routes}
  </Router>,
  document.getElementById('app')
)
