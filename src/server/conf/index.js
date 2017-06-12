/* @flow */

import prodConf from '../../../conf/app.json'
const isDev: boolean = process.env.NODE_ENV === 'development'
const localConf: Object = isDev ? require('../../../conf/app.local.json') : {}

const conf: Object = {
  ...prodConf,
  ...localConf
}

export default conf
