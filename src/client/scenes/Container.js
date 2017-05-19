/* @flow */

import React from 'react'
import Navigation from 'Navigation'

const Container = ({children}: {children: Object}): React.Element<any> => {
  return (
    <div>
      <Navigation />
      { children }
    </div>
  )
}

export default Container
