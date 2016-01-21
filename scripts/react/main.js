'use strict'
var d = React.DOM
var initializeUI = function() {
  $('#app').css('display', 'none')
  $('.master').css('display', 'table-cell')
  ReactDOM.render(React.createElement(LoggedOutApp, {onConnect: function() {
    ReactDOM.render(React.createElement(LoggedInApp), $('#app')[0])
    $('#app').css('display', 'table-cell')
    $('.master').css('display', 'none')
  }}), $('#loginApp')[0])
}
Initializer.initialize(function() {
  SessionManager.onLoggedOut(initializeUI)
  initializeUI()
})