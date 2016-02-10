'use strict'

var Modal = require('../core/modal')
var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var TeamInfo = require('../../utils/TeamInfo')
var PieChart = require('../core/pieChart')
var DateFormat = require('../../utils/DateFormat')
var MyButton = require('../core/button')
var Logo = require('../core/logo')

var d = React.DOM

//Modal match stats
var ModalMatchStats = React.createClass({
  getInitialState: function() {
    return {modalShown: false}
  },
  showModal: function(){
    this.setState({modalShown: true})
  },
  hideModal: function(){
    this.setState({modalShown: false})
  },
  render: function() {
    return d.div(null,
      React.createElement(MyButton, {
        fontSize: 15,
        style: {
          marginTop: '4px',
          padding: '4px 11px'
        },
        onClick: this.showModal
      }, d.i({className: "fa fa-bar-chart"})),
      React.createElement(Modal, {
        shown: this.state.modalShown,
        onClose: this.hideModal,
        width: 740
      }, React.createElement(MatchStats, {matchId: this.props.matchId}))
    )
  }
})

//Composant match stats
var MatchStats = React.createClass({
  displayName: 'MatchStats',
  getInitialState: function() {
    return {isLoadingData: true, isLoadingRanking: true}
  },
  handleData: function(data) {
    this.setState({isLoadingData: false, data: data})
  },
  handleRanking: function(data) {
    this.setState({isLoadingRanking: false, rankingL1: data})
  },
  componentWillMount: function() {
    var options = {
      url: './api/rankingL1.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleRanking)
    var options = {
      url: './api/matchStats.php?matchId=' + this.props.matchId,
      method: 'GET',
    }
    Ajax.request(options, this.handleData)
  },
  renderLineLegend: function(type, number) {
    var color = null
    if (type == 'Victoire') {
      color = COLOR.green
    }
    else if (type == 'Nul') {
      color = COLOR.gray3
    }
    else {
      color = COLOR.accent
    }
    return d.div({
      style: {
        display: 'inline-block',
        height: '20px',
        fontSize: '12px',
        lineHeight: '20px'
      }
    }, d.div({
      style: {
        display: 'inline-block',
        height: '10px',
        width: '10px',
        paddingtop: '5px',
        marginRight: '5px',
        backgroundColor: color
      }
    }), type + ' (' + number + ')')
  },
  renderLegendPieChart: function(win, nul, loose) {
    return d.div({
      style: {
        display: 'inline-block',
        width: '100px',
        textAlign: 'left',
        float: 'left',
        paddingTop: '45px',
        paddingLeft: '20px'
      }
    },
      this.renderLineLegend('Victoire', win),
      this.renderLineLegend('Nul', nul),
      this.renderLineLegend('Défaite', loose)
    )
  },
  renderTitlePieChart: function(team) {
    var domicile = this.state.data.match.teamDomicile
    return d.div({
      style: {
        backgroundColor: COLOR.blue,
        height: '30px',
        lineHeight: '30px',
        color: COLOR.white,
        textAlign: 'center'
      }
    },
      TeamInfo.get(team).countryName + (team == domicile ? " à domicile" : " à l'exterieur") + ' (saison en cours)'
    )
  },
  renderPieChart: function(win, nul, loose) {
    return d.div({
      style: {
        display: 'inline-block'
      }
    }, React.createElement(PieChart, {win: win, nul: nul, loose: loose}))
  },
  renderContentPieChart: function(team) {
    var matchs = null
    if (team == this.state.data.match.teamDomicile) {
      matchs = this.state.data.matchsDomicile
    }
    else {
      matchs = this.state.data.matchsExterieur
    }
    var win = 0
    var nul = 0
    var loose = 0
    var winPercent = 0
    var nulPercent = 0
    var loosePercent = 0
    for (var i = 0; i < matchs.length; i++) {
      var domicile = team == matchs[i].teamDomicile ? true : false
      if (matchs[i].scoreDomicile > matchs[i].scoreExterieur) {
        domicile ? win++ : loose++
      }
      else if (matchs[i].scoreDomicile == matchs[i].scoreExterieur) {
        nul++
      }
      else {
        domicile ? loose++ : win++
      }
    }
    var winPercent = win / matchs.length * 100
    var nulPercent = nul / matchs.length * 100
    var loosePercent = loose / matchs.length * 100
    return d.div({
      style: {
        height: '150px',
        backgroundColor: COLOR.white,
        textAlign: 'left'
      }
    },
      this.renderLegendPieChart(win, nul, loose),
      this.renderPieChart(winPercent, nulPercent, loosePercent)
    )
  },
  renderBlocPieChart: function(team) {
    var marginRight = this.state.data.match.teamDomicile == team ? '10px' : 0
    return d.div({
      style: {
        display: 'inline-block',
        width: '350px',
        marginRight: marginRight,
        marginBottom: '10px'
      }
    },
      this.renderTitlePieChart(team),
      this.renderContentPieChart(team)
    )
  },
  renderMatchHistorical: function(match, type) {
    var teamDomicile = match.teamDomicile
    var teamExterieur = match.teamExterieur
    var score = match.scoreDomicile + ' - ' + match.scoreExterieur
    var color = COLOR.dark
    var domicile = null
    if (type == 'domicile') {
      if (teamDomicile == this.state.data.match.teamDomicile) {
        var domicile = true
      }
      else {
        domicile = false
      }
    }
    else {
      if (teamDomicile == this.state.data.match.teamExterieur) {
        var domicile = true
      }
      else {
        domicile = false
      }
    }
    if (match.scoreDomicile > match.scoreExterieur) {
      color = domicile ? COLOR.green : COLOR.accent
    }
    else if (match.scoreDomicile == match.scoreExterieur) {
      color = COLOR.gray3
    }
    else {
      color = domicile ? COLOR.accent : COLOR.green
    }
    return d.div({
      key: 'matchHistorical' + match.matchId,
      style: {
        backgroundColor: COLOR.white,
        height: '30px',
        width: '350px',
        color: COLOR.black,
        textAlign: 'center',
        lineHeight: '30px',
        fontSize: '16px',
        marginTop: '10px'
      }
    },
      d.div({
        style: {
          color: COLOR.black,
          display: 'inline-block',
          textAlign: 'right',
          width: '120px'
        }
      },
        TeamInfo.get(teamDomicile).countryName,
        React.createElement(Logo, {name: teamDomicile, float: 'right', margin: '5px 5px'})
      ),
      d.div({
        style: {
          color: color,
          display: 'inline-block',
          padding: '0 10px',
          fontWeight: 'bold',
          width: '50px'
        }
      }, score),
      d.div({
        style: {
          color: COLOR.black,
          display: 'inline-block',
          textAlign: 'left',
          width: '120px'
        }
      },
        TeamInfo.get(teamExterieur).countryName,
        React.createElement(Logo, {name: teamExterieur, float: 'left', margin: '5px 5px'})
      )
    )
  },
  renderMatchHistoricalResult: function(type) {
    var elements = []
    var match = this.state.data.match
    var matchs = type == 'domicile' ? this.state.data.matchsDomicileTeam : this.state.data.matchsExterieurTeam
    for (var i = 0; i < 5; i++) {
      var team = null
      if (type == 'domicile') {
        team = matchs[i].teamDomicile == match.teamDomicile ? 'domicile' : 'exterieur'
      } else {
        team = matchs[i].teamDomicile == match.teamExterieur ? 'domicile' : 'exterieur'
      }

      if (matchs[i].scoreDomicile > matchs[i].scoreExterieur) {
        elements.push(d.span({
          key: 'resultSymbol' + i,
          style: {
            fontWeight: 'bold',
            color: team == 'domicile' ? COLOR.green : COLOR.accent
          }
        }, team == 'domicile' ? 'V' : 'D'))
      }
      else if (matchs[i].scoreDomicile == matchs[i].scoreExterieur) {
        elements.push(d.span({
          key: 'resultSymbol' + i,
          style: {
            fontWeight: 'bold',
            color: COLOR.gray3
          }
        }, 'N'))
      }
      else {
        elements.push(d.span({
          key: 'resultSymbol' + i,
          style: {
            fontWeight: 'bold',
            color: team == 'domicile' ? COLOR.accent : COLOR.green
          }
        }, team == 'domicile' ? 'D' : 'V'))
      }

      elements.push(i <= 3 ? d.span({ key: 'resultSlash' + i }, ' / ') : null)
    }
    return d.div({
      key: 'matchHistoricalResult',
      style: {
        display: 'inline-block',
        height: '30px',
        lineHeight: '30px',
        width: '350px',
        backgroundColor: COLOR.white,
        textAlign: 'center'
      }
    }, elements)
  },
  renderBlocMatchHistorical: function(type) {
    var marginRight = type == 'domicile' ? '10px' : 0
    var elements = []
    elements.push(this.renderMatchHistoricalResult(type))
    for (var i = 0; i < 5; i++) {
      var match = type == 'domicile' ? this.state.data.matchsDomicileTeam[i] : this.state.data.matchsExterieurTeam[i]
      elements.push(this.renderMatchHistorical(match, type))
    }
    return d.div({
      style: {
        display: 'inline-block',
        width: '350px',
        marginRight: marginRight,
        marginBottom: '10px'
      }
    }, elements)
  },
  renderTitle: function(text) {
    return d.div({
      style:{
        backgroundColor: COLOR.blue,
        height: '30px',
        textAlign: 'left',
        color: COLOR.white,
        lineHeight: '30px',
        fontSize: '16px',
        paddingLeft: '10px',
        marginBottom: '10px'
      }
    }, text)
  },
  renderMatch: function(match, score) {
    var teamDomicile = match.teamDomicile
    var teamExterieur = match.teamExterieur
    var rankingDomicile = 0
    var rankingExterieur = 0
    for (var i = 0; i < this.state.rankingL1.rankingL1.length; i++) {
      if (teamDomicile == this.state.rankingL1.rankingL1[i].name) {
        rankingDomicile = this.state.rankingL1.rankingL1[i].rank
      }
      if (teamExterieur == this.state.rankingL1.rankingL1[i].name) {
        rankingExterieur = this.state.rankingL1.rankingL1[i].rank
      }
    }
    var fontType = 'normal'
    if (score == 'score') {
      var score = match.scoreDomicile + ' - ' + match.scoreExterieur
      fontType = 'bold'
    }
    else {
      var score = DateFormat.getTime(match.date)
    }
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        height: '40px',
        color: COLOR.black,
        textAlign: 'center',
        lineHeight: '40px',
        fontSize: '16px',
        marginBottom: '10px'
      }
    },
      d.div({
        style: {
          color: COLOR.black,
          display: 'inline-block',
          textAlign: 'right',
          width: '170px'
        }
      },
        TeamInfo.get(teamDomicile).countryName,
        score !== 'score' ? ' (' + rankingDomicile + ')' : null,
        React.createElement(Logo, {name: teamDomicile, float: 'right', margin: '10px 10px'})
      ),
      d.div({
        style: {
          color: COLOR.dark,
          display: 'inline-block',
          padding: '0 10px',
          fontWeight: fontType,
          width: '50px'
        }
      }, score),
      d.div({
        style: {
          color: COLOR.black,
          display: 'inline-block',
          textAlign: 'left',
          width: '170px'
        }
      },
        TeamInfo.get(teamExterieur).countryName,
        score !== 'score' ? ' (' + rankingExterieur + ')' : null,
        React.createElement(Logo, {name: teamExterieur, float: 'left', margin: '10px 10px'})
      )
    )
  },
  render: function() {
    var style = {
      display: 'inline-block',
      width: '710px',
      backgroundColor: COLOR.gray1,
      borderRadius: '5px',
      padding: '15px 15px 5px 15px'
    }
    if (this.state.isLoadingData || this.state.isLoadingRanking) {
      return d.div({ style: style },
        'Chargement ',
        d.i({className: "fa fa-spinner fa-pulse"})
      )
    } else {
      var matchAller = this.state.data.matchAller ? this.renderMatch(this.state.data.matchAller, 'score') : null
      return d.div({ style: style },
        this.renderTitle(DateFormat.getDate(this.state.data.match.date)),
        this.renderMatch(this.state.data.match, 'time'),
        this.renderTitle('Derniers résultats'),
        this.renderBlocMatchHistorical('domicile'),
        this.renderBlocMatchHistorical('exterieur'),
        this.renderBlocPieChart(this.state.data.match.teamDomicile),
        this.renderBlocPieChart(this.state.data.match.teamExterieur),
        this.renderTitle('Match aller'),
        matchAller
      )
    }
  }
})

module.exports = ModalMatchStats
