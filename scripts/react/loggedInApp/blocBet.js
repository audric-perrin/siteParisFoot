'use strict'
var d = React.DOM
//Bloc bet
var BlocBet = React.createClass({
  onBet: function() {
    this.props.onBet()
  },
  render: function() {
    var element = [
      React.createElement(BetTable, {onBet: this.onBet}),
      React.createElement(RankingL1)
    ]
    return d.div({
      style: {
        height: '100%',
        textAlign: 'center'
      }
    },element)
  }
})