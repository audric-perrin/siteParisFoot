'use strict'

var all = {}

var TeamInfo = {
  get: function(name) {
    return all[name]
  },
  initialize: function(teamInfo) {
    all = teamInfo
  }
}

module.exports = TeamInfo
