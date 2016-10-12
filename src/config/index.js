const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = {
  test: {
    app: {
      port: process.env.PORT || 3333,
      name: 'Koa React Gulp Mongoose Mocha'
    },
    mongo: {
      url: 'mongodb://localhost/koareactfullexample'
    }
  },
  development: {
    app: {
      port: process.env.PORT || 3333,
      name: 'Koa React Gulp Mongoose Mocha'
    },
    mongo: {
      url: 'mongodb://localhost:27017/liaofan'
    }
  },
  production: {
    app: {
      port: process.env.PORT || 3333,
      name: 'Koa React Gulp Mongoose Mocha'
    },
    mongo: {
      url: 'mongodb://localhost/koareactfullexample'
    }
  }
}
module.exports = config[env]
