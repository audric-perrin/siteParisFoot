'use strict'

var TeamInfo = require('./TeamInfo')

var initializedCb = null
var teamInfoInitialized = false

var teamInfoResult = function(teamInfo) {
  TeamInfo.initialize(teamInfo)
  teamInfoInitialized = true
  if (Initializer.isInitialized()) {
    initializedCb()
  }
}

var Initializer = {
  isInitialized: function() {
    return teamInfoInitialized
  },
  initialize: function(cb) {
    initializedCb = cb
    var options = {
      url: './api/teamInfo.php',
      method: 'GET',
    }
    $.ajax(options).done(teamInfoResult)
  }
}

module.exports = Initializer
