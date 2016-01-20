'use strict'
var d = React.DOM
//Bloc gestion composant result
var BlocResult = React.createClass({
  getInitialState: function() {
    return {round: null, macthSelected: null}
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
    console.log(this.state.round)
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
        }, React.createElement(MyBetResultManager, {round: this.state.round}))
      )
    }
    elements.push(
      d.div({
        style: {
          display: 'inline-block',
          verticalAlign: 'top'
        }
      }, React.createElement(ManagerComparisonBet, {
        onClose: this.onMatchSelectedClose,
        round: this.state.round, 
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