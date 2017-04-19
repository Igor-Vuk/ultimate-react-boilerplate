/* @flow */

import React from 'react'
import Navigation from 'Navigation'

function Container ({children}: {children: Object}): React.Element<any> {
  return (
    <div>
      <Navigation />
      { children }
    </div>
  )
}

export default Container
