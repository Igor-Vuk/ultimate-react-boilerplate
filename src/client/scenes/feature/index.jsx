/* @flow */
/* eslint "jsx-quotes": ["error", "prefer-double"] */   // eslint rule to prefer doublequotes inside html tags

import React, { Component } from 'react'
import FormComponent from './components/FormComponent.jsx'

class Feature extends Component {
  render (): React.Element<any> {
    return (
      <div>
        {/* Plugin in defferent components here for this scene */}
        <FormComponent />
      </div>
    )
  }
}

export default Feature
