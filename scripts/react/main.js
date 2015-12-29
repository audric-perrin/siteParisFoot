'use strict'
var d = React.DOM
$('body').css({backgroundColor: COLOR.gray1, fontFamily: 'Helvetica'})
var LoggedState = {
  loading: 0,
  loggedIn: 1,
  loggedOut: 2
}
var Main = React.createClass({
  getInitialState: function(){
    return {loggedState: LoggedState.loading}
  },
  onConnect: function() {
    this.setState({loggedState: LoggedState.loggedIn})
  },
  componentWillMount: function() {
    SessionManager.onLoggedOut(this.onLoggedOut.bind(this))
    var options = {url: './api/userInfo.php', method: 'GET'}
    var that = this
    var userInfoCallback = function(data) {
      if (data.result == 'not connected') {
        that.setState({loggedState: LoggedState.loggedOut})
      }
      else {
        that.setState({loggedState: LoggedState.loggedIn})
      }
    }
    $.ajax(options).done(userInfoCallback)
  },
  onLoggedOut: function() {
    this.setState({loggedState: LoggedState.loggedOut})
  },
  render: function() {
    var element = null
    var style = null
    if (this.state.loggedState == LoggedState.loggedIn) {
      element = React.createElement(LoggedInApp)
      style = {
        width: '80%',
        margin: 'auto',
        backgroundColor: COLOR.white
      }
    }
    else if (this.state.loggedState == LoggedState.loggedOut) {
      element = React.createElement(LoggedOutApp, {onConnect: this.onConnect})
      style = {
        position: 'absolute',
        backgroundColor: COLOR.white,
        height: '100%',
        right: '10%',
        left: '10%'
      }
    }
    else {
      element = React.createElement(LoadingApp)
      style = {
        position: 'absolute',
        backgroundColor: COLOR.white,
        height: '100%',
        right: '10%',
        left: '10%'
      }
    }
    return d.div({style: style}, element)
  }
})
Initializer.initialize(function () {
  ReactDOM.render(React.createElement(Main), $('#app')[0])
})
//LoadingApp
var LoadingApp = React.createClass({
  logo: function() {
    return d.div({
      style: { 
        display: 'inline-block',
        verticalAlign: 'middle',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(./images/bannerBetChallenger.png)',
        backgroundPosition: 'center center',
        height: '50%',
        width: '50%'
      }
    })
  },
  struct: function() {
    return d.div({
      style: {
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%'
      }
    })
  },
  render: function() {
    return d.div({
      style: {
        height: '100%',
        textAlign: 'center'
      }
    }, this.struct(), this.logo())
  }
})