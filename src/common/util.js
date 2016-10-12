'use strict'
const crypto = require('crypto')

exports.getMd5 = function (data, limit) {
  const md5 = crypto.createHash('md5').update(data).digest('hex')
  if (limit && typeof limit === 'number') {
    return md5.substr(0, limit)
  }
  return md5
}
