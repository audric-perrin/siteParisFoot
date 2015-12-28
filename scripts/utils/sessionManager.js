'use strict'
var callbacks = []
var SessionManager = {
  onLoggedOut: function(callback) {
    callbacks.push(callback)
  },
  triggerLogOut: function() {
    for (var i = 0; i < callbacks.length; i++){
      callbacks[i]()
    }
  }
}