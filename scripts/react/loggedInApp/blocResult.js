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
    return d.table({
      style: {
        height: '100%',
        margin: 'auto'
      }
    },
      d.tbody(null,
        d.tr({},
          d.td({
            style: {padding: '0 15px'}
          }, React.createElement(Result, {handleRound: this.handleRound})),
          d.td({
            style: {padding: '0 15px'}
          }, React.createElement(BetResultManager, {round: this.state.round})),
          d.td({
            style: {padding: '0 15px'}
          }, React.createElement(ManagerComparisonBet, {round: this.state.round}))
        )
      )
    )
  }
})