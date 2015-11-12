'use strict'
var d = React.DOM
var LoggedOutApp = React.createClass({
  onConnect: function() {
    if (this.props.onConnect) {
      this.props.onConnect()
    }
  },
  render: function() {
    return d.div({}, React.createElement(Box_login, {onConnect: this.onConnect}))
  }
})