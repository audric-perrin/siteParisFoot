'use strict'
var d = React.DOM
$('body').css({backgroundColor: COLOR.gray1, fontFamily: 'Helvetica'})
var Main = React.createClass({
  getInitialState: function(){
    return {isLoggedIn: false}
  },
  onConnect: function() {
    this.setState({isLoggedIn: true})
  },
  render: function(){
    var element = null
    if (this.state.isLoggedIn) {
      element = React.createElement(LoggedInApp)
    }
    else {
      element = React.createElement(LoggedOutApp, {onConnect: this.onConnect})
    }
    return d.div({}, element)
  }
})
Initializer.initialize(function () {
  React.render(React.createElement(Main), document.body)
})
var options = {url: './api/userInfo.php', method: 'GET'}
var userInfoCallback = function(data) {
  if (data.result == 'not connected') {
    var options = {
      url: './api/login.php',
      method: 'POST',
      data: {
        username: 'Castor',
        password: 'castor'
      }
    }
    var loginCallback = function(data) {
      console.log(data)
    }
    $.ajax(options).done(loginCallback)
  }
  else {
    console.log('Déjà connecté')
  }
}
$.ajax(options).done(userInfoCallback)

//CREATE COMPONENT loadingApp

//list importation donnee/a quel moment?