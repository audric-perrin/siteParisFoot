'use strict'
var d = React.DOM
var LoggedOutApp = React.createClass({
  getInitialState: function() {
    return {isLogin: true}
  },
  onConnect: function() {
    if (this.props.onConnect) {
      this.props.onConnect()
    }
  },  
  struct: function() {
    return d.div({
      style: {
        display: 'inline-block',
        verticalAlign: 'middle',
      }
    })
  },
  onSwitch: function() {
    this.setState({isLogin: !this.state.isLogin})
  },
  render: function() {
    var element = null
    if (this.state.isLogin) {
      element = React.createElement(Box_login, {onConnect: this.onConnect, onSwitch: this.onSwitch})
    }
    else {
      element = React.createElement(Box_signup, {onSignup: this.onConnect, onSwitch: this.onSwitch})
    }
    return d.div({
      style: {
        height: '100%',
        textAlign: 'center'
      }
    }, this.struct(), element)
  }
})