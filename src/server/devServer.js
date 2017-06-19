/* @flow */

import Express from 'express'
import path from 'path'

const app: Express = new Express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(Express.static(path.join(__dirname, '../', 'dist')))

// Routes
app.get('*', (req: Object, res: Object) => {
  res.render('index')
})

export default app
