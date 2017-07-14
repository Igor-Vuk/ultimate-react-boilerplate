/* @flow */

import Express from 'express'
import path from 'path'
import conf from './conf'
import appRenderer from './helper/appRenderer'
import webpackUtils from './helper/webpackUtils'
import expressStaticGzip from 'express-static-gzip'

const PORT: number = conf.APP_PORT
const app: Express = new Express()

/* In webpack.config if we do target: node, and we set __dirname: true, webpack will set __dirname to what it was in our source file (in our case the root) */
app.set('views', path.join(__dirname, 'src', 'build', 'views'))
app.set('view engine', 'ejs')

/* set max-age to '1y' (maximum) or 31536000 for client static assets */
/* If we enable brotli we must also enable it in webpackUtils.config.prod.js */
app.use(expressStaticGzip(path.join(__dirname, 'src', 'dist'), {indexFromEmptyFile: false, enableBrotli: false, maxAge: '1y'}))

/* check with the server before using the cached resource */
app.use((req: Object, res: Object, next: () => void): void => {
  res.set('Cache-Control', 'no-cache')
  return next()
})

/* Use server side rendering for first load */
app.use(appRenderer)

/* Use CommonChunks and long term caching */
app.use(webpackUtils)

// Routes
app.get('*', (req: Object, res: Object) => {
  res.render('index', {app: req.body, webpack: req.chunk})
})

app.listen(PORT, () => {
  console.log(`Node server is listening on port ${PORT}`)
})
