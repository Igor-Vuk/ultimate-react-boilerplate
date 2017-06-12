/* @flow */

import Express from 'express'
import path from 'path'
import conf from './conf'

const APP_PORT: number = conf.APP_PORT
const PORT: any = process.env.PORT || APP_PORT

const app: Express = new Express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(Express.static(path.join(__dirname, '../', 'dist')))

/* In production use server side rendering for first load */
if (process.env.NODE_ENV === 'production') {
  const appRenderer = require('./appRenderer').default
  app.use(appRenderer)
}

// Routes
app.get('*', (req: Object, res: Object) => {
  res.render('index', {app: req.body})
})

if (process.env.NODE_ENV === 'production') {
  app.listen(PORT, () => {
    console.log(`
    Express server is up on port ${PORT}
    Production environment
    `)
  })
}

export default app
