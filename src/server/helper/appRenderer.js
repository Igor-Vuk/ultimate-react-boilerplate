/* @flow */

import React from 'react'
import ReactDOM from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from '../../client/routes'

function render (component: Object): string {
  const content: string = ReactDOM.renderToString(component)
  return content
}

async function getMatchParams (routes: Object, currentUrl: string): Promise<Object> {
  return new Promise((resolve: (data: any) => void, reject: (error: any) => void) => {
    match({routes: routes, location: currentUrl}, (err: Object, redirect: Object, props: Object): ?Object => {
      if (err) {
        return reject(err)
      }
      return resolve(props)
    })
  })
}

export default async (req: Object, res: Object, next: () => void): Promise<void> => {
  const renderProps: Object = await getMatchParams(routes, req.url)
  if (renderProps) {
    const component = (
      <RouterContext {...renderProps} />
    )
    req.body = await render(component)
    next()
  }
}
