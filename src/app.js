const path = require('path')
const Koa = require('koa')
const views = require('koa-views')
const serve = require('koa-static')
const onerror = require('koa-onerror')
const log4js = require('log4js')
const util = require('util')

const middleware = require('./middleware')
const logger = log4js.getLogger('app.js')
const database = require('./config/database')
const config = require('./config')
const router = require('./routes')
const app = new Koa()

app.keys = ['secret', 'lisa']

// 初始化数据库
database()

// 静态资源目录
app.use(serve(path.join(__dirname, '../static')))

// Views
app.use(views(path.join(__dirname, '../views'), {
  extensio: 'swig',
  map: {
    html: 'swig'
  }
}))

// global error
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    logger.error('global error', e, ctx)
    ctx.body = {
      code: e.status || 90001,
      data: '',
      message: e.message || 'Server internal error.'
    }
  }
})

app.on('error', function (err, ctx) {
  logger.error('server error', err, ctx)
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(middleware())

onerror(app, {
  engine: 'swig',
  template: path.join(__dirname, '../views/500.html')
})

app.use(router.routes()).use(router.allowedMethods())

// 404
app.use(async (ctx, next) => {
  logger.info('请求404')
  util.log(`request to ${JSON.stringify(ctx.request.url)}`)
  ctx.status = 404
  await ctx.render('404')
})

// TODO log4js使用示例
// logger.trace('Entering cheese testing')
// logger.debug('Some debug messages.')
// logger.warn('Cheese is quite smelly.')
// logger.error('Cheese is too ripe!')
// logger.fatal('Cheese was breeding ground for listeria.')

logger.info('Server Start listening on port: ', config.app.port || '3333')
app.listen(config.app.port || '3333')

module.exports = app
