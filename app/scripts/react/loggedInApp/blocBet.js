'use strict'

var BetTable = require('./bet')
var RankingL1 = require('./rankingL1')
var d = React.DOM

//Bloc bet
var BlocBet = React.createClass({
  displayName: 'BlocBet',
  onBet: function() {
    this.props.onBet()
  },
  render: function() {
    return d.div({
      style: {
        height: '100%',
        textAlign: 'center'
      }
    },
      React.createElement(BetTable, {onBet: this.onBet}),
      React.createElement(RankingL1)
    )
  }
})

module.exports = BlocBet
