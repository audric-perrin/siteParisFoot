'use strict'

var COLOR = require('../../utils/style')
var MyBetResultManager = require('./betResultManager')
var ManagerComparisonBet = require('./managerComparisonBet')
var Result = require('./result')
var d = React.DOM

//Bloc gestion composant result
var BlocResult = React.createClass({
  displayName: 'BlocResult',
  getInitialState: function() {
    return {round: null, macthSelected: null, saison: null}
  },
  handleRound: function(round) {
    this.setState({round: round, macthSelected: null})
  },
  onMatchSelected: function(matchId) {
    this.setState({macthSelected: matchId})
  },
  onMatchSelectedClose: function() {
    this.setState({macthSelected: null})
  },
  render: function() {
    var elements = []
    elements.push(
      d.div({
        key: 'result',
        style: {
          display: 'inline-block',
          marginRight: '30px',
          verticalAlign: 'top'
        }
      }, React.createElement(Result, {handleRound: this.handleRound}))
    )
    if (!this.state.macthSelected) {
      elements.push(
        d.div({
          key: 'resultManager',
          style: {
            display: 'inline-block',
            marginRight: '30px',
            padding: '15px',
            backgroundColor: COLOR.gray1,
            borderRadius: '5px',
            verticalAlign: 'top'
          }
        }, React.createElement(MyBetResultManager, {round: this.state.round, saison: this.state.saison}))
      )
    }
    elements.push(
      d.div({
        key: 'managerComparisonBet',
        style: {
          display: 'inline-block',
          verticalAlign: 'top'
        }
      }, React.createElement(ManagerComparisonBet, {
        onClose: this.onMatchSelectedClose,
        round: this.state.round,
        saison: this.state.saison,
        onSelect: this.onMatchSelected,
        matchId: this.state.macthSelected
      }))
    )
    return d.div({
      style: {
        height: '100%'
      }
    }, elements)
  }
})

module.exports = BlocResult
