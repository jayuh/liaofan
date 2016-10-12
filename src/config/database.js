const log4js = require('log4js')
const mongoose = require('mongoose')
const config = require('./index')
const logger = log4js.getLogger('app.js')

module.exports = function () {
  mongoose.Promise = global.Promise
  mongoose.set('debug', true)
  mongoose.connect(config.mongo.url)
  mongoose.connection.on('error', (e) => logger.error(`Liaofan database connection error，error：${e}`))
  mongoose.connection.on('open', (e) => logger.info('Successfully opened the database Liaofan.'))
  mongoose.connection.on('close', (e) => logger.info('Liaofan the database connection closed.'))
  mongoose.connection.on('connected', (e) => logger.info('Liaofan The database is connected.'))
}
