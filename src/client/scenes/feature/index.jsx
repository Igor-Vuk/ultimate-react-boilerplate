/* @flow */
/* eslint "jsx-quotes": ["error", "prefer-double"] */ // eslint rule to prefer doublequotes inside html tags

import React, { Component } from 'react'
import FormComponent from 'FormComponent'

class Feature extends Component {
  render (): React.Element<any> {
    return (
      <div>
        {/* Place to put defferent components for this scene */}
        <FormComponent />
      </div>
    )
  }
}

export default Feature
