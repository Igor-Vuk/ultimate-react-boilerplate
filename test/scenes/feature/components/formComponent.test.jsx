/* @flow */

import 'jsdom-global/register'
import register from 'ignore-styles'
import React from 'react'
import { shallow, mount } from 'enzyme'
import test from 'tape'
import sinon from 'sinon'
import FormComponent from '../../../../src/client/scenes/feature/components/FormComponent.jsx'

// Ignore styles and return fake styleName
register(undefined, () => ({styleName: 'fake_class_name'}))

test('FormComponent => should exist', (t: Object) => {
  t.ok(FormComponent)
  t.end()
})
