'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var DateFormat = require('../../utils/DateFormat')
var MyButton = require('../core/button')
var BetResultManager = require('./betResultManager')
var MatchBetDetail = require('./matchBetDetail')
var d = React.DOM

//Barre bleu victoire
var ManagerComparisonBet = React.createClass({
  displayName: 'ManagerComparisonBet',
  getInitialState: function() {
    return {isClick: false, matchs: null, round: null, isLoading: true}
  },
  changeRound: function (round) {
    this.setState({matchs: null, round: round, isLoading: true})
    var options = {
      url: './api/match.php?round=' + round,
      method: 'GET',
    }
    Ajax.request(options, this.handleMatches)
    if (this.props.handleRound) {
      this.props.handleRound(round)
    }
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.round) {
      this.changeRound(newProps.round)
    }
  },
  handleMatches: function(data) {
    this.setState({matchs: data.match, isLoading: false})
  },
  handleCurrentRound: function(data) {
    this.changeRound(data.currentRound)
  },
  componentWillMount: function() {
    if (this.props.round) {
      this.changeRound(this.props.round)
    }
    else {
      var options = {
        url: './api/currentRound.php',
        method: 'GET',
      }
      Ajax.request(options, this.handleCurrentRound)
    }
    if (this.props.matchId) {
      this.onSelectedMatch(this.props.matchId)
    }
  },
  onClose: function() {
    this.setState({matchSelected: null})
    this.setState({isClick: false})
    this.props.onClose()
  },
  onClick: function() {
    this.setState({isClick: true})
  },
  onSelectedMatch: function(matchId) {
    this.setState({matchSelected: matchId})
    this.props.onSelect(matchId)
  },
  renderLineDetailSelect: function(match) {
    return d.div({
      key: match.matchId + 'lineDetail',
      style:{
        textAlign: 'left',
        height : '30px',
        marginTop: '10px',
        padding: '0 10px',
        backgroundColor: COLOR.white
      }
    },
      d.div({
        style: {
          display: 'inline-block',
        }
      }, 'Voir détail du match'),
      d.div({
        style: {
          display: 'inline-block',
          height: '30px',
          margin: '5px 0 0 10px',
          textAlign: 'right'
        }
      }, React.createElement(MyButton, {
          fontSize: 20,
          onClick: this.onSelectedMatch.bind(this, match.matchId),
          style: {
            width: '20px',
            height: '20px',
            boxSizing: 'border-box',
            margin: '0',
            padding: '0'
          }
        }, d.i({className: "fa fa-eye"}))
      )
    )
  },
  render: function() {
    var elements = [
      React.createElement(MyButton, {
        key: 'button',
        fontSize: 20,
        onClick: this.onClick,
        style: {
          width: '50px',
          height: '30px',
          boxSizing: 'border-box',
          margin: '0 0 5px 0'
        }
      }, d.i({className: "fa fa-user-plus"})),
    ]
    if (this.state.matchs) {
      var actualDate = 0
      for (var i = 0; i < this.state.matchs.length; i++) {
        var match = this.state.matchs[i]
        if (actualDate != DateFormat.getDate(match.date)) {
          elements.push(d.div({
            key: 'dateBlock' + actualDate,
            style: {
              backgroundColor: COLOR.blue,
              height: '30px',
              marginTop: '10px'
            }
          }))
          actualDate = DateFormat.getDate(match.date)
        }
        elements.push(this.renderLineDetailSelect(this.state.matchs[i]))
      }
    }
    if (this.state.isClick) {
      elements = React.createElement(BetResultManager, {
        round: this.state.round,
        selectIndex: 1,
        onClose: this.onClose
      })
    }
    if (this.state.matchSelected && this.state.matchs) {
      elements = React.createElement(MatchBetDetail, {
        matchs: this.state.matchs,
        matchId: this.state.matchSelected,
        onClose: this.onClose
      })
    }
    return d.div({
      style: {
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        borderRadius: '5px',
        padding: '15px'
      }
    }, d.div({style: {height: '100%'}}, elements))
  }
})

module.exports = ManagerComparisonBet
