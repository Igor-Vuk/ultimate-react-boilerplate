/* @flow */

import Express from 'express'
import path from 'path'
import conf from './conf'

const APP_PORT: number = conf.APP_PORT
const PORT: any = process.env.PORT || APP_PORT

const app: Express = new Express()

// Middleware
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(Express.static(path.join(__dirname, '../', 'dist')))

// Routes
app.get('*', (req: Object, res: Object) => {
  res.render('index')
})

app.listen(PORT, () => {
  console.log(`Express server is up on port ${PORT}`)
})
