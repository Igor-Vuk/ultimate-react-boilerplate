/* @flow */

import React from 'react'
import { Route } from 'react-router'
import Container from 'Container'
import Feature from 'Feature'

export default (
  <Route path='/' component={Container} >
    <Route path='feature' component={Feature} />
  </Route>
)
