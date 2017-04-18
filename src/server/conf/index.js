/* @flow */

import defaultConf from '../../../conf/app.json'
const isDev: boolean = process.env.NODE_ENV === 'development'
const localConf: Object = isDev ? require('../../../conf/app.local.json') : {}

const conf: Object = {
  ...defaultConf,
  ...localConf
}

export default conf
