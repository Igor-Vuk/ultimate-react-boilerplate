/* @flow */

import Express from 'express'
import path from 'path'

const app: Express = new Express()

/* In webpack.config if we do target: node, and we set __dirname: true, webpack will set __dirname to what it was in our source file (in our case the root) */
app.set('views', path.join(__dirname, 'src', 'server', 'views'))
app.set('view engine', 'ejs')

app.use(Express.static(path.join(__dirname, 'src', 'dist')))

// Routes
app.get('*', (req: Object, res: Object) => {
  res.render('index')
})

export default app
