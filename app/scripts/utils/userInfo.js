'use strict'

var userInfo = {}

var UserInfo = {
  get: function() {
    return userInfo
  },
  initialize: function(info) {
    userInfo = info
  }
}

module.exports = UserInfo