const path = require('path')
const compose = require('koa-compose')
const json = require('koa-json')
const convert = require('koa-convert')
const logger = require('koa-logger')
const cors = require('koa-cors')
const bodyParser = require('koa-bodyparser')
const session = require('koa-generic-session')
const MongoSession = require('koa-generic-session-mongo')
const statics = require('koa-static')
// const CSRF = require('koa-csrf').default
const config = require('../config')

// const koaRedis = require('koa-redis')
// const redisStore = koaRedis({
//   url: config.redisUrl
// })

const mongoStore = new MongoSession({
  url: config.mongo.url,
  collection: 'lisa_session'
})

module.exports = function middleware () {
  return compose([
    convert(logger()),
    convert(cors()),
    // convert(new CSRF()),
    convert(json()),
    convert(statics(path.join(__dirname, '/public'))),
    convert(bodyParser()),
    convert(session({
      store: mongoStore,
      prefix: 'lisa:sess:',
      key: 'lisa.sid'
    }))
  ])
}
