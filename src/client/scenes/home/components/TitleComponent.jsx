/* @flow */
/* eslint "jsx-quotes": ["error", "prefer-double"] */ // eslint rule to prefer doublequotes inside html tags

import React, {Component} from 'react'
import './titleComponent.local.scss'
import logo from '../../../styles/img/react_logo.png'

class TitleComponent extends Component {
  render (): React.Element<any> {
    return (
      <div styleName="container">
        <h2 styleName="align-center">Home Scene</h2>
        <img src={logo} alt="logo" styleName="imageRotate" className="img-fluid mx-auto d-block" />
      </div>
    )
  }
}

export default TitleComponent
