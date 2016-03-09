'use strict'

var callbacks = []

var SessionManager = {
  onLoggedOut: function(callback) {
    callbacks.push(callback)
  },
  deconnexion: function(callback) {
    var options = {
      url: './api/logOut.php',
      method: 'GET',
    }
    var Ajax = require('./ajax')
    Ajax.request(options, function() {
      SessionManager.triggerLogOut()
      if (callback) {
        callback()
      }
    })
  },
  triggerLogOut: function() {
    for (var i = 0; i < callbacks.length; i++){
      callbacks[i]()
    }
  }
}

module.exports = SessionManager
