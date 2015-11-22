'use strict'
var d = React.DOM
//Barre bleu victoire
var BlocResult = React.createClass({
  getInitialState: function() {
    return {round: null}
  },
  handleRound: function(round) {
    this.setState({round: round})
  },
  render: function() {
    var element = [
      React.createElement(Result, {handleRound: this.handleRound}),
      React.createElement(BetResultManager, {round: this.state.round}),
      React.createElement(BetResultManager, {round: this.state.round})
    ]
    return d.div({
      style: {
        height: '100%',
        textAlign: 'center'
      }
    },element)
  }
})