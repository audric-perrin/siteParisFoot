'use strict'
var d = React.DOM
var App = React.createClass({
  render: function () {
    return d.div(null, React.createElement(Box_login), React.createElement(Box_signup))
  }
})

React.render(React.createElement(App), document.body)