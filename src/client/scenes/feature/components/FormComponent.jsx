/* @flow */
/* eslint "jsx-quotes": ["error", "prefer-double"] */ // eslint rule to prefer doublequotes inside html tags

import React, { Component } from 'react'
import './formComponent.local.scss'

class FormComponent extends Component {
  render (): React.Element<any> {
    return (
      <div styleName="container" className="container">

        <h2>Demo Form Scene</h2>

        <form>
          <div className="form-group" styleName="formula">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" styleName="formControl" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <div className="form-group">
            <label htmlFor="exampleSelect1">Example select</label>
            <select className="form-control" id="exampleSelect1">
              <option>one</option>
              <option>two</option>
              <option>three</option>
              <option>four</option>
              <option>five</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="exampleSelect2">Example multiple select</label>
            <select multiple className="form-control" id="exampleSelect2">
              <option>one</option>
              <option>two</option>
              <option>three</option>
              <option>four</option>
              <option>five</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="exampleTextarea">Example textarea</label>
            <textarea className="form-control" id="exampleTextarea" rows="3" />
          </div>
          <button type="submit" className="btn btn-primary" styleName="custom-btn">Submit</button>
        </form>

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#myModal">Launch demo modal</button>
        <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Feature scene</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                You are on the Feature scene
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default FormComponent
