/* @flow */
/* eslint "jsx-quotes": ["error", "prefer-double"] */   // eslint rule to prefer doublequotes inside html tags

import React, { Component } from 'react'
import {Link, IndexLink} from 'react-router'
import './index.local.scss'

class Navigation extends Component {
  render (): React.Element<any> {
    return (
      <div>
        {/* For Demonstration purpose */}

        <nav className="navbar navbar-toggleable-sm navbar-light bg-faded">
          {/* hamburger menu on small screen size */}
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          {/* navigation bar brend */}
          <a className="navbar-brand" href="/">React Boilerplate</a>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <IndexLink to="/" className="nav-item nav-link active" href="#">Home <span className="sr-only">(current)</span></IndexLink>
              <Link to="/feature" className="nav-item nav-link" href="#">Feature</Link>
            </div>
            <div className="navbar-nav ml-auto">
              <span className="navbar-text">Made by <a href="https://github.com/Igor-Vuk" styleName="nav-text" target="_blank">Igor Vukelic</a></span>
            </div>
          </div>
        </nav>

        <h2 styleName="header">Navigation Scene - shared between the components</h2>

      </div>
    )
  }
}

export default Navigation
