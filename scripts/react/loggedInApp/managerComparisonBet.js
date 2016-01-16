'use strict'
var d = React.DOM
//Barre bleu victoire
var ManagerComparisonBet = React.createClass({
  getInitialState: function() {
    return {isClick: false, matchs: null, round: null, isLoading: true}
  },
  changeRound: function (round) {
    this.setState({matchs: null, round: round, isLoading: true})
    var options = {
      url: './api/match.php?round=' + round,
      method: 'GET',
    }
    Ajax.request(options, this.handleMatches.bind(this))
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
    var options = {
      url: './api/currentRound.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleCurrentRound.bind(this))
  },
  onClick: function() {
    this.setState({isClick: true})
  },
  onSelectedMatch: function(matchId) {
    this.setState({matchSelected: matchId})
    this.props.onSelect(matchId)
  },
  renderLineDate: function() {
    return d.div({
      style: {
        backgroundColor: COLOR.blue,
        height: '30px',
        marginTop: '10px'
      }
    })
  },
  renderLineDetailSelect: function(match) {
    return d.div({
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
          elements.push(this.renderLineDate())
          actualDate = DateFormat.getDate(match.date)
        }
        elements.push(this.renderLineDetailSelect(this.state.matchs[i]))
      }
    }
    if (this.state.isClick) {
      elements = React.createElement(BetResultManager, {round: this.props.round, selectIndex: 1})
    }
    if (this.state.matchSelected) {
      elements = React.createElement(MatchBetDetail, {matchId: this.state.matchSelected})
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