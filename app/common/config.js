'use strict'

module.exports = {
  header: {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
    api: {
      base: 'http://rap.taobao.org/mockjs/16005/',
      creations: 'api/creations',
      up: 'api/up',
      comment: 'api/comments',
      singup: 'api/u/singup',
      verify: 'api/u/verify'
    }
  }
