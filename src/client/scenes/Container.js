/* @flow */

import React from 'react'

function Container ({children}: {children: Object}): React.Element<any> {
  return (
    <div>
      <h1>Container</h1>
      { children }
    </div>
  )
}

export default Container
