/* @flow */

/* webpack creates manifest file inside dist folder after runnin webpack on client side */
import webpackManifest from '../dist/manifest.json'

type ChunksType = {
  bundle: string,
  vendor: string,
  stylesLocal: string,
  stylesGlobal: string
}

export default (req: Object, res: Object, next: () => void) => {
  const chunks: ChunksType = {
    bundle: webpackManifest['bundle.js'],
    vendor: webpackManifest['vendor.js'],
    stylesLocal: webpackManifest['localcss.css'],
    stylesGlobal: webpackManifest['bundle.css']
  }
  if (chunks) {
    req.chunk = chunks
    next()
  }
}
