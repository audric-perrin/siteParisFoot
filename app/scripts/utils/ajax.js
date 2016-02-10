'use strict'

var SessionManager = require('./SessionManager')

var Ajax = {
  request: function (options, callback) {
    var handleResponse = function(data) {
      if (data && data.error == 'loggedOut') {
        SessionManager.triggerLogOut()
      }
      else {
        callback(data)
      }
    }
    $.ajax(options).done(handleResponse)
  }
}

module.exports = Ajax
