/* @flow */

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Container from 'Container'
import Feature from 'Feature'
import Home from 'Home'

export default (
  <Route path='/' component={Container} >
    <Route path='feature' component={Feature} />
    <IndexRoute component={Home} />
  </Route>
)
