'use strict'

var COLOR = require('../../utils/style')
var d = React.DOM

//Composant table paris
var Ranking = React.createClass({
  displayName: 'Ranking',
  renderCell: function(element, specificStyle) {
    var style = {
      textAlign: 'center',
      padding: '0 10px'
    }
    style = $.extend(true, style, specificStyle)
    return d.td({style: style}, element)
  },
  renderDataRanking: function() {
    var elements = [
      d.tr({
        key: 'headerLine',
        style:{
          backgroundColor: COLOR.white,
          height: '30px',
          textAlign: 'left',
          color: COLOR.gray2,
          fontSize: '16px',
          fontFamily: 'Helvetica',
          paddingLeft: '10px',
          lineHeight: '30px'
        }
      },
        this.renderCell('N°', { padding: '0 15px' }),
        this.renderCell('Pseudo', { textAlign: 'left' }),
        this.renderCell('MJ'),
        this.renderCell('1N2'),
        this.renderCell('PTS.1N2'),
        this.renderCell('Score'),
        this.renderCell('PTS.Score'),
        this.renderCell('PTS', { padding: '0 10px 0 20px' })
      )
    ]
    if (this.props.ranking) {
      for (var i = 0; i < this.props.ranking.length; i++) {
        elements.push(this.renderLineRanking(i))
      }
    }
    return d.table({
      style:{
        width: '100%'
      }
    }, d.tbody(null, elements))
  },
  renderLineRanking : function(index) {
    var ranking = this.props.ranking[index]
    var styleRank = {
      padding: '0, 15px'
    }
    var styleUsername = {
      textAlign: 'left',
      padding: '0 0 0 10px',
      width: '250px'
    }
    var styleGlobalPoint = {
      padding: '0 10px 0 20px',
      color: COLOR.dark
    }
    var fontWeight = ranking.myBet ? 600 : 'none'
    return d.tr({
      key: ranking.userId + 'line',
      style:{
        backgroundColor: COLOR.white,
        height: '30px',
        borderTop: 'solid 1px' + COLOR.gray1,
        textAlign: 'left',
        color: COLOR.black,
        fontSize: '16px',
        fontWeight: fontWeight,
        fontFamily: 'Helvetica',
        paddingLeft: '10px',
        lineHeight: '30px'
      }
    },
      this.renderCell(ranking.rank, styleRank),
      this.renderCell(ranking.username, styleUsername),
      this.renderCell(ranking.betCount),
      this.renderCell(ranking.betWon),
      this.renderCell(ranking.betPoint.toFixed(2)),
      this.renderCell(ranking.scoreWon),
      this.renderCell(ranking.scorePoint.toFixed(2)),
      this.renderCell(ranking.globalPoint.toFixed(2), styleGlobalPoint)
    )
  },
  render: function () {
    return d.div({
      style: {
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        borderRadius: '5px',
        textAlign: 'center',
        width: '100%'
      }
    }, this.renderDataRanking())
  }
})

module.exports = Ranking
