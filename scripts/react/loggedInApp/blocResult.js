'use strict'
var d = React.DOM
//Barre bleu victoire
var BlocResult = React.createClass({
  render: function() {
    var element = [
      React.createElement(Result),
      React.createElement(BetResultManager)
    ]
    return d.div({
      style: {
        height: '100%',
        textAlign: 'center'
      }
    },element)
  }
})