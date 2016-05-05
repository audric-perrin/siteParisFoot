'use strict'

var LoggedInApp = require('./react/loggedInApp/loggedInApp')
var LoggedOutApp = require('./react/loggedOutApp/loggedOutApp')
var Initializer = require('./utils/Initializer')
var UserInfo = require('./utils/userInfo')
var SessionManager = require('./utils/sessionManager')

var d = React.DOM

var initializeUI = function(connected) {
  if (connected) {
    ReactDOM.render(React.createElement(LoggedInApp), $('#app')[0])
    $('#app').css('display', 'table-cell')
    $('.master').css('display', 'none')
  }
  else {
    $('#app').css('display', 'none')
    $('.master').css('display', 'table-cell')
    ReactDOM.render(React.createElement(LoggedOutApp, {
      onConnect: function() {
        initializeUI(true)
      }
    }), $('#loginApp')[0])
  }
}
Initializer.initialize(function() {
  SessionManager.onLoggedOut(initializeUI.bind(this, false))
  var options = {url: './api/userInfo.php', method: 'GET'}
  $.ajax(options).done(function(data) {
    UserInfo.initialize(data)
    if (data.result == 'not connected') {
      initializeUI(false)
    }
    else {
      initializeUI(true)
    }
  })
})
