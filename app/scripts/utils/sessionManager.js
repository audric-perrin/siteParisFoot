'use strict'

var callbacks = []
var Ajax = require('./ajax')

var SessionManager = {
  onLoggedOut: function(callback) {
    callbacks.push(callback)
  },
  deconnexion: function() {
    var options = {
      url: './api/logOut.php',
      method: 'GET',
    }
    Ajax.request(options, this.triggerLogOut)
  },
  triggerLogOut: function() {
    for (var i = 0; i < callbacks.length; i++){
      callbacks[i]()
    }
  }
}

module.exports = SessionManager
