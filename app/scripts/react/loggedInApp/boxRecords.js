'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var TeamInfo = require('../../utils/TeamInfo')
var Logo = require('../core/logo')
var d = React.DOM

//Composant manager records
var BoxRecords = React.createClass({
  displayName: 'BoxRecords',
  renderTitle: function() {
    return d.div({
      style: {
        backgroundColor: COLOR.blue,
        color: COLOR.white,
        height: '40px',
        lineHeight: '40px',
        paddingLeft: '5px',
        textAlign: 'center',
        marginBottom: '10px',
      }
    }, this.props.title)
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
    var data = this.props.data
    var coteScore = 0
    var rank = 0
    for (var i = 0; i < data.length; i++) {
      if (coteScore !== data[i].coteScore) {
        var rank = rank + 1
        if (rank > 3) {
          break
        }
      }
      elements.push(this.renderLineRanking
        (i, 
        rank, 
        data[i].userName, 
        data[i].coteScore, 
        data[i].teamDomicile,
        data[i].teamExterieur,
        data[i].scoreDomicile,
        data[i].scoreExterieur
        )
      )
      coteScore = data[i].coteScore
    }
    return d.table({
      style:{
        padding: '0 10px',
        width: '100%'
      }
    }, d.tbody(null, elements))
  },
  renderLineRanking : function(key, rank, userName, coteScore, teamDomicile, teamExterieur, scoreDomicile, scoreExterieur) {
    var logoDomicile = React.createElement(Logo, {name: teamDomicile, float: 'left', margin: '-5px 10px'})
    var logoExterieur = React.createElement(Logo, {name: teamExterieur, float: 'left', margin: '-5px 10px'})
    var teamDomicile = TeamInfo.get(teamDomicile).countryName
    var teamExterieur = TeamInfo.get(teamExterieur).countryName
    var tiret = '-'
    var color = null
    if (rank < 2) {
      color = COLOR.gold
    }
    else if (rank < 3) {
      color = COLOR.silver
    }
    else {
      color = COLOR.bronze
    }
    var styleRank = {
      backgroundColor: color,
      padding: '0 10px',
      color: COLOR.white
    }
    var styleUserName = {
      textAlign: 'left',
      padding: '0 0 0 10px',
      width: '200px'
    }
    var styleCoteScore = {
      padding: '0 10px 0 20px',
      color: COLOR.dark
    }
    var styleTeamDomicile = {
      textAlign: 'left',
      width: '100px'
    }
    var styleTeamExterieur = {
      textAlign: 'right',
      width: '100px'
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
      this.renderCell(coteScore, styleCoteScore),
      this.renderCell(logoDomicile),
      this.renderCell(teamDomicile, styleTeamDomicile),
      this.renderCell(scoreDomicile),
      this.renderCell(tiret),
      this.renderCell(scoreExterieur),
      this.renderCell(teamExterieur, styleTeamExterieur),
      this.renderCell(logoExterieur)
    )
  },
  render: function() {
    var elements = []
    elements.push(this.renderTitle())
    elements.push(this.renderDataRanking())
    return d.div({
      style: {
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        padding: '15px',
        borderRadius: '5px'
      }
    }, elements)
  }
})

module.exports = BoxRecords