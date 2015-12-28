'use strict'
var d = React.DOM
//Composant application
var MyBetResult = React.createClass({
  getInitialState: function() {
    return {isLoading: true, userSelect: null, userBets: null, matchs: null, round: null}
  },
  changeRound: function (round, userId) {
    this.setState({matchs: null, userBets: null, round: round})
    var options = {
      url: './api/betUser.php?user=' + userId + '&round=' + round,
      method: 'GET',
    }
    Ajax.request(options, this.handleBet.bind(this))
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
        width: '213px',
        marginTop: '10px',
        // textAlign: 'left',
        color: COLOR.white,
        fontSize: '16px',
        fontFamily: 'Helvetica',
        paddingLeft: '10px',
        lineHeight: '30px'
      }
    })
  },
  renderLine: function(match, userBet) {
    if (userBet) {
      var coteResultWin = false
      var endMatch = false
      if (match.scoreDomicile != -1 && match.scoreDomicile > match.scoreExterieur && userBet.scoreDomicile > userBet.scoreExterieur) {
        coteResultWin = true
      }
      if (match.scoreDomicile != -1 && match.scoreDomicile < match.scoreExterieur && userBet.scoreDomicile < userBet.scoreExterieur) {
        coteResultWin = true
      }
      if (match.scoreDomicile != -1 && match.scoreDomicile == match.scoreExterieur && userBet.scoreDomicile == userBet.scoreExterieur) {
        coteResultWin = true
      }
      if (match.scoreDomicile != -1) {
        endMatch = true
      }
      var coteScoreWin = false
      if (match.scoreDomicile != -1 && match.scoreDomicile == userBet.scoreDomicile && match.scoreExterieur == userBet.scoreExterieur) {
        coteScoreWin = true
      }
      var scoreDomicile = parseFloat(userBet.scoreDomicile)
      var scoreExterieur = parseFloat(userBet.scoreExterieur)
      var coteResult = parseFloat(userBet.coteResult)
      var coteScore = parseFloat(userBet.coteScore)
      var domicileWin = scoreDomicile > scoreExterieur
      var matchNul = scoreDomicile == scoreExterieur
      var nameScore = scoreDomicile + ' - ' + scoreExterieur
      if (matchNul) {
        var elementsMyBet = React.createElement(MyBet, {      
          nameResult: 'Nul',
          coteResult: coteResult,
          nameScore: nameScore,
          coteScore: coteScore,
          height: '30px',
          coteResultWin: coteResultWin,
          coteScoreWin: coteScoreWin,
          endMatch: endMatch
        })
      }
      else if (domicileWin) {
        var elementsMyBet = React.createElement(MyBet, {
          nameResult: match.teamDomicile,
          coteResult: coteResult,
          nameScore: nameScore,
          coteScore: coteScore,
          height: '30px',
          coteResultWin: coteResultWin,
          coteScoreWin: coteScoreWin,
          endMatch: endMatch
        })
      }
      else {
        var elementsMyBet = React.createElement(MyBet, {      
          nameResult: match.teamExterieur,
          coteResult: coteResult,
          nameScore: nameScore,
          coteScore: coteScore,
          height: '30px',
          coteResultWin: coteResultWin,
          coteScoreWin: coteScoreWin,
          endMatch: endMatch
        })
      }
      return d.div({
        style: {
          // display: 'inline-block',
          backgroundColor: COLOR.white,
          width: '213px',
          textAlign: 'center',
          lineHeight: '30px',
          padding: '0 5px',
          verticalAlign: 'middle',
          height: '30px',
          margin: '10px 5px 0 0'
        }
      }, elementsMyBet)
    }
    else {
      return d.div({
        style: {
          // display: 'inline-block',
          backgroundColor: COLOR.white,
          width: '213px',
          textAlign: 'center',
          lineHeight: '30px',
          padding: '0 5px',
          verticalAlign: 'middle',
          height: '30px',
          margin: '10px 5px 0 0'
        }
      }, 'Pas de pari sur ce match')
    }
  },
  render: function() {
    if (this.state.matchs) {
      var elements = []
      var actualDate = 0
      for (var i = 0; i < this.state.matchs.length; i++) {
        var match = this.state.matchs[i]
        if (actualDate != DateFormat.getDate(match.date)) {
          elements.push(this.renderLineDate())
          actualDate = DateFormat.getDate(match.date)
        }
        elements.push(this.renderLine(match, this.state.userBets[match.matchId]))
      }
    }
    return d.div({
      style: {      
        verticalAlign: 'middle',
        // display: 'inline-block'
      }
    }, elements)
  }
})