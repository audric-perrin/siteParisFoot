'use strict'
var d = React.DOM
//Manager de classement
var RankingManager = React.createClass({
  getInitialState: function() {
    return {rankSelected: 1, dropDownSelected: 0}
  },
  onRankChanged: function(newRank) {
    this.setState({rankSelected: newRank, dropDownSelected: 0})
  },
  render: function() {
    return d.div({
      style: {
        verticalAlign: 'top',
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        padding: '15px',
        borderRadius: '5px',
        boxSizing: 'border-box'
      }
    }, 
      React.createElement(SelectRanking, {onRankChanged: this.onRankChanged}),
      React.createElement(Ranking)
    )
  }
})