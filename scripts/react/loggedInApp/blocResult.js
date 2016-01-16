'use strict'
var d = React.DOM
//Bloc gestion composant result
var BlocResult = React.createClass({
  getInitialState: function() {
    return {round: null, macthSelected: null}
  },
  handleRound: function(round) {
    this.setState({round: round})
  },
  onMatchSelected: function(matchId) {
    this.setState({macthSelected: matchId})
  },
  render: function() {
    console.log(this.state)
    var elements = []
    elements.push(
      d.div({
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
          style: {
            display: 'inline-block',
            marginRight: '30px',
            padding: '15px',
            backgroundColor: COLOR.gray1,
            borderRadius: '5px',
            verticalAlign: 'top'
          }
        }, React.createElement(BetResultManager, {round: this.state.round}))
      )
    }
    elements.push(
      d.div({
        style: {
          display: 'inline-block',
          verticalAlign: 'top'
        }
      }, React.createElement(ManagerComparisonBet, {round: this.state.round, onSelect: this.onMatchSelected}))
    )
    return d.div({
      style: {
        height: '100%'
      }
    }, elements)
  }
})