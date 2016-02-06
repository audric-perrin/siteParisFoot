'use strict'

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
