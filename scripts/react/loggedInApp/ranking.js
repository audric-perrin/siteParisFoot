'use strict'
var d = React.DOM
//Composant table paris
var Ranking = React.createClass({
  getInitialState: function() {
    return {isLoading: true, ranking: null}
  },
  componentWillMount: function() {
    this.dataRanking()
  },
  dataRanking: function () {
    var options = {
      url: './api/ranking.php',
      method: 'GET',
    }
    this.setState({isLoading: true})
    $.ajax(options).done(this.handleRanking)
  },
  handleRanking: function(data) {
    this.setState({isLoading: false, ranking: data.ranking})
  },
  renderTitle: function() {
    var title = this.props.title ? this.props.title : 'Classement général'
    return d.div({
      style:{
        backgroundColor: COLOR.blue,
        height: '30px',
        margin: '10px 0',
        textAlign: 'left',
        color: COLOR.white,
        fontSize: '16px',
        fontFamily: 'Helvetica',
        paddingLeft: '10px',
        lineHeight: '30px'
      }
    }, title)
  },
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
    if (this.state.ranking){    
      for (var i = 0; i < this.state.ranking.length; i++) {
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
    return d.table({}, elements)
  },
  renderLineRanking : function(index) {
    var ranking = this.state.ranking[index]
    var style = {}
    var styleRank = {
      padding: '0, 15px'
    }
    var styleUsername = {
      textAlign: 'left',
      padding: '0 50px 0 10px'
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
    console.log(this.state)
    var elements = [
      this.renderTitle(),
      this.renderDataRanking()
    ]
    if (this.state.isLoading) {
        return d.div({
        style:{
          fontSize: '16px',
          marginTop: '10px',
          padding: '15px 0',
          color: COLOR.black,
          backgroundColor: COLOR.white,
        }
      }, d.i({
        style: {
          display: 'block',
          fontSize: '40px',
          marginBottom: '5px',
          color: COLOR.gray3
        },
        className: "fa fa-spinner fa-pulse"
      }), "Chargement des Classements")
    }
    else {
      return d.div({
        style: {
          display: 'inline-block',
          backgroundColor: COLOR.gray1,
          borderRadius: '5px',
          textAlign: 'center',
          padding: '5px 15px 15px 15px'
        }
      }, elements)
    }
  }
})