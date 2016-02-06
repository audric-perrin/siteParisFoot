'use strict'

var Ajax = require('../../utils/ajax')
var DateFormat = require('../../utils/DateFormat')
var COLOR = require('../../utils/style')
var RenderBetResult = require('../core/renderBetResult')
var d = React.DOM

//Composant application
var MyBetResult = React.createClass({
  displayName: 'MyBetResult',
  getInitialState: function() {
    return {isLoading: true, userSelect: null, userBets: null, matchs: null, round: null}
  },
  changeRound: function (round, userId) {
    this.setState({matchs: null, userBets: null, round: round})
    var options = {
      url: './api/betUser.php?user=' + userId + '&round=' + round,
      method: 'GET',
    }
    Ajax.request(options, this.handleBet)
  },
  handleBet: function(data) {
    this.setState({userBets: data.userBets, matchs: data.matchs})
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.round && newProps.userSelect) {
      this.changeRound(newProps.round, newProps.userSelect)
    }
  },
  componentWillMount: function() {
    if (this.props.round && this.props.userSelect) {
      this.changeRound(this.props.round, this.props.userSelect)
    }
  },
  renderLineDate: function() {
    return d.div({
      style:{
        backgroundColor: COLOR.blue,
        height: '30px',
        marginTop: '10px',
        color: COLOR.white,
        fontSize: '16px',
        fontFamily: 'Helvetica',
        paddingLeft: '10px',
        lineHeight: '30px'
      }
    })
  },
  render: function() {
    if (this.state.matchs) {
      var elements = []
      var actualDate = 0
      for (var i = 0; i < this.state.matchs.length; i++) {
        var match = this.state.matchs[i]
        if (actualDate != DateFormat.getDate(match.date)) {
          elements.push(d.div({
            key: match.matchId + 'dateBlock',
            style:{
              backgroundColor: COLOR.blue,
              height: '30px',
              marginTop: '10px',
              color: COLOR.white,
              fontSize: '16px',
              fontFamily: 'Helvetica',
              paddingLeft: '10px',
              lineHeight: '30px'
            }
          }))
          actualDate = DateFormat.getDate(match.date)
        }
        elements.push(React.createElement(RenderBetResult, {key: match.matchId, match: match, bet: this.state.userBets[match.matchId]}))
      }
    }
    return d.div({
      style: {
        verticalAlign: 'middle',
      }
    }, elements)
  }
})

module.exports = MyBetResult
