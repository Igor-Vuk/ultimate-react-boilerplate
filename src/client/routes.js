/* @flow */

import React from 'react'
import { Route } from 'react-router'
import Container from 'Container'
import First from 'First'

export default (
  <Route path='/' component={Container} >
    <Route path='first' component={First} />
  </Route>
)
