/* @flow */

import React from 'react'
import { shallow, mount } from 'enzyme'
import test from 'tape'
import sinon from 'sinon'
import sinonTest from 'sinon-test'
import FormComponent from 'FormComponent'
sinon.test = sinonTest.configureTest(sinon)

test('FormComponent => should exist', sinon.test(function (t: Object) {
  t.plan(1)
  t.ok(FormComponent)
}))
