'use strict'
var d = React.DOM
//Composant résumé pari
var RenderBetResult = React.createClass({
  render: function() {
    var match = this.props.match
    var userBet = this.props.bet
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
          backgroundColor: COLOR.white,
          textAlign: 'center',
          lineHeight: '30px',
          padding: '0 5px',
          verticalAlign: 'middle',
          height: '30px',
          margin: this.props.margin === '0' ? this.props.margin : '10px 0 0 0'
        }
      }, elementsMyBet)
    }
    else {
      return d.div({
        style: {
          backgroundColor: COLOR.white,
          textAlign: 'center',
          lineHeight: '30px',
          padding: '0 5px',
          verticalAlign: 'middle',
          height: '30px',
          margin: '10px 0 0 0'
        }
      }, 'Pas de pari sur ce match')
    }
  }
})