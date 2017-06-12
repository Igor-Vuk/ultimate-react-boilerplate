/* @flow */
/* eslint "jsx-quotes": ["error", "prefer-double"] */ // eslint rule to prefer doublequotes inside html tags

import React, {Component} from 'react'
import './titleComponent.local.scss'

class TitleComponent extends Component {
  render (): React.Element<any> {
    return (
      <div styleName="container">
        <h1>Home Scene</h1>
      </div>
    )
  }
}

export default TitleComponent
