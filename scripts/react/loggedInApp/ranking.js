'use strict'
var d = React.DOM
//Composant table paris
var Ranking = React.createClass({
  renderCell: function(element, specificStyle) {
    var style = {
      textAlign: 'center',
      padding: '0 10px'
    }
    style = $.extend(true, style, specificStyle)
    return d.td({style: style}, element)
  },
  renderDataRanking: function() {
    var elements = []
    if (this.props.ranking){    
      for (var i = 0; i < this.props.ranking.length; i++) {
        if (i == 0) {
          var styleRank = {
            padding: '0 15px'
          }
          var stylePseudo = {
            textAlign: 'left'
          }
          var stylePTS = {
            padding: '0 10px 0 20px',
          }
          var header = [
            this.renderCell('N°', styleRank),
            this.renderCell('Pseudo', stylePseudo),
            this.renderCell('MJ'),
            this.renderCell('RG'),
            this.renderCell('PTSR'),
            this.renderCell('SG'),
            this.renderCell('PTSS'),
            this.renderCell('PTS', stylePTS),
            this.renderCell('EVL')
          ]
          elements.push(d.tr({
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
          }, header))
        }
        elements.push(this.renderLineRanking(i))
      }
    }
    return d.table({style:{width: '100%'}}, elements)
  },
  renderLineRanking : function(index) {
    var ranking = this.props.ranking[index]
    var style = {}
    var styleRank = {
      padding: '0, 15px'
    }
    var styleUsername = {
      textAlign: 'left',
      padding: '0 0 0 10px',
      width: '300px'
    }
    var styleGlobalPoint = {
      padding: '0 10px 0 20px',
      color: COLOR.dark
    }
    var color = COLOR.black
    if (ranking.evolution > 0) {
      var color = COLOR.green
    }
    else if (ranking.evolution < 0) {
      var color = COLOR.accent
    }
    var styleEvolution = {
      color: color
    }
    var elements = [
      this.renderCell(ranking.rank, styleRank),
      this.renderCell(ranking.username, styleUsername),
      this.renderCell(ranking.betCount, style),
      this.renderCell(ranking.betWon, style),
      this.renderCell(ranking.betPoint.toFixed(2), style),
      this.renderCell(ranking.scoreWon, style),
      this.renderCell(ranking.scorePoint.toFixed(2), style),
      this.renderCell(ranking.globalPoint.toFixed(2), styleGlobalPoint),
      this.renderCell(ranking.evolution > 0 ? '+' + ranking.evolution : ranking.evolution, styleEvolution)
    ]
    var fontWeight = null
    ranking.myBet ? fontWeight = 600 : fontWeight = 'none'
    return d.tr({
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
    }, elements)
  },
  render: function () {
    var elements = [this.renderDataRanking()]
    return d.div({
      style: {
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        borderRadius: '5px',
        textAlign: 'center',
        width: '100%'
      }
    }, elements)
  }
})