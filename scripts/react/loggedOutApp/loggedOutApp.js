'use strict'
var d = React.DOM
var LoggedOutApp = React.createClass({
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
    }, this.struct(), React.createElement(Box_login, {onConnect: this.onConnect}))
  }
})