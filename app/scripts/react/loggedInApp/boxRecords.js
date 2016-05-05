'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var TeamInfo = require('../../utils/TeamInfo')
var DateFormat = require('../../utils/DateFormat')
var Logo = require('../core/logo')
var d = React.DOM

//Composant manager records
var BoxRecords = React.createClass({
  displayName: 'BoxRecords',
  getInitialState: function() {
    return {isClick: false, isHover: false}
  },
  renderTitle: function() {
    return d.div({
      style: {
        backgroundColor: COLOR.blue,
        color: COLOR.white,
        height: '40px',
        lineHeight: '40px',
        paddingLeft: '5px',
        textAlign: 'center',
        marginBottom: '10px'
      }
    }, this.props.data.title)
  },
  arrowClick: function() {
    if (this.state.isClick) {
      this.setState({isClick: false})
    }
    else {
      this.setState({isClick: true})
    }
  },
  arrowHover: function() {
    if (this.state.isHover) {
      this.setState({isHover: false})
    }
    else {
      this.setState({isHover: true})
    }
  },
  renderArrow: function() {
    return d.div({
      style: {
        color: this.state.isHover ? COLOR.blue2 : COLOR.blue,
        backgroundColor: COLOR.white,
        height: '30px',
        fontSize: '20px',
        lineHeight: '30px',
        paddingLeft: '5px',
        textAlign: 'center',
        marginTop: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.3s'
      },
      onClick: this.arrowClick,
      onMouseOver: this.arrowHover.bind(this, true),
      onMouseOut: this.arrowHover.bind(this, false)
    }, this.state.isClick ? d.i({className: "fa fa-chevron-up"}) : '•••')
  },
  renderCell: function(element, specificStyle) {
    var style = {
      textAlign: 'center',
    }
    style = $.extend(true, style, specificStyle)
    return d.td({style: style}, element)
  },
  renderDataRanking: function() {
    var elements = []
    var data = this.props.data.ranking
    var limit = this.state.isClick ? 10000 : 3
    for (var i = 0; i < data.length; i++) {
      if (data[i].value == 0) {
        break
      }
      if (data[i].rank > limit) {
        break
      }
      elements.push(this.renderLineRanking(
        i,
        this.props.data.type,
        data[i].rank, 
        data[i].userName, 
        data[i].value,
        data[i].extra
      ))
    }
    return d.table({
      style:{
        padding: '0 10px',
        width: '100%'
      }
    }, d.tbody(null, elements))
  },
  renderLineRanking : function(key, type, rank, userName, score, extra) {
    var color = null
    var backgroundColor = null
    if (rank < 2) {
      backgroundColor = COLOR.gold
      color = COLOR.white
    }
    else if (rank < 3) {
      backgroundColor = COLOR.silver
      color = COLOR.white
    }
    else if (rank < 4){
      backgroundColor = COLOR.bronze
      color = COLOR.white
    }
    else {
      backgroundColor = COLOR.white
      color = COLOR.black
    }
    var styleRank = {
      backgroundColor: backgroundColor,
      padding: '0 10px',
      color: color
    }
    var styleUserName = {
      textAlign: 'left',
      padding: '0 0 0 10px',
      width: '200px'
    }
    var styleScore = {
      padding: '0 10px 0 20px',
      color: COLOR.dark,
      width: '80px'
    }
    return d.tr({
      key: key,
      style:{
        backgroundColor: COLOR.white,
        height: '30px',
        borderTop: 'solid 1px' + COLOR.gray1,
        textAlign: 'left',
        color: COLOR.black,
        fontSize: '16px',
        fontFamily: 'Helvetica',
        paddingLeft: '10px',
        lineHeight: '30px'
      }
    },
      this.renderCell(rank, styleRank),
      this.renderCell(userName, styleUserName),
      this.renderCell(score, styleScore),
      this.renderCell(this.renderExtra(extra, type))
    )
  },
  //Choix de l'affichage d'extra
  renderExtra: function(extra, type) {
    if (type == 'match') {
      return this.renderExtraMatch(extra)
    }
    if (type == 'round') {
      return this.renderExtraRound(extra)
    }    
    if (type == 'month') {
      return this.renderExtraMonth(extra)
    }
    if (type == 'team') {
      return this.renderExtraTeam(extra)
    }
  },
  renderExtraMatch: function(extra) {
    var logoDomicile = React.createElement(Logo, {name: extra.teamDomicile, float: 'left', margin: '-5px 10px'})
    var logoExterieur = React.createElement(Logo, {name: extra.teamExterieur, float: 'left', margin: '-5px 10px'})
    var teamDomicile = TeamInfo.get(extra.teamDomicile).countryName
    var teamExterieur = TeamInfo.get(extra.teamExterieur).countryName
    var tiret = '-'
    var styleTeamDomicile = {textAlign: 'left', width: '100px'}
    var styleTeamExterieur = {textAlign: 'right', width: '100px'}
    return d.table({style: {width: '310px'}}, d.tbody(null, d.tr(null,
      this.renderCell(logoDomicile),
      this.renderCell(teamDomicile, styleTeamDomicile),
      this.renderCell(extra.scoreDomicile),
      this.renderCell(tiret),
      this.renderCell(extra.scoreExterieur),
      this.renderCell(teamExterieur, styleTeamExterieur),
      this.renderCell(logoExterieur)
    )))
  },
  renderExtraRound: function(extra) {
    var styleRound = {textAlign: 'left', paddingLeft: '30px'}
    var styleSaison = {textAlign: 'right', paddingRight: '30px'}
    return d.table({style: {width: '310px'}}, d.tbody(null, d.tr(null,
      this.renderCell('Journée ' + extra.round, styleRound),
      this.renderCell('Saison ' + extra.saison, styleSaison)
    )))
  },
  renderExtraMonth: function(extra) {
    var styleMonth = {textAlign: 'left', paddingLeft: '30px'}
    var styleSaison = {textAlign: 'right', paddingRight: '30px'}
    return d.table({style: {width: '310px'}}, d.tbody(null, d.tr(null,
      this.renderCell(DateFormat.getMonth(extra.date), styleMonth),
      this.renderCell('Saison ' + extra.saison, styleSaison)
    )))
  },
  renderExtraTeam: function(extra) {
    var logoTeam = React.createElement(Logo, {name: extra.team, float: 'left', margin: '-5px 10px'})
    var team = TeamInfo.get(extra.team).trueName
    var styleTeam = {textAlign: 'right' ,paddingRight: '30px'}
    var styleLogo = {textAlign: 'left' ,paddingLeft: '30px'}
    return d.table({style: {width: '310px'}}, d.tbody(null, d.tr(null,
      this.renderCell(logoTeam, styleLogo),
      this.renderCell(team, styleTeam)
    )))
  },
  render: function() {
    return d.div({
      style: {
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        padding: '15px',
        borderRadius: '5px',
        width: '650px',
        marginBottom: '15px'
      }
    }, this.renderTitle(), this.renderDataRanking(), this.renderArrow())
  }
})

module.exports = BoxRecords