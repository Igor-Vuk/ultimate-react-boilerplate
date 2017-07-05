/* @flow */

import React from 'react'
import { shallow, mount } from 'enzyme'
import test from 'tape'
import sinon from 'sinon'
import sinonTestFactory from 'sinon-test'
import FormComponent from 'FormComponent'
const sinonTest = sinonTestFactory(sinon)

test('FormComponent => should exist', sinonTest(function (t: Object) {
  t.plan(1)
  t.ok(FormComponent)
}))
