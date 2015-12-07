'use strict'
var d = React.DOM
//Composant table paris
var RankingL1 = React.createClass({
  getInitialState: function() {
    return {isLoading: true, ranking: null, isArrowClick: false}
  },
  componentWillMount: function() {
    this.dataRanking()
  },
  dataRanking: function () {
    var options = {
      url: './api/rankingL1.php',
      method: 'GET',
    }
    this.setState({isLoading: true})
    $.ajax(options).done(this.handleRanking)
  },
  handleRanking: function(data) {
    this.setState({isLoading: false, ranking: data.rankingL1})
  },
  onArrowClick: function() {
    this.state.isArrowClick ? this.setState({isArrowClick: false}) : this.setState({isArrowClick: true})
  },
  renderTitle: function() {
    var title = [
      'Classement L1',
      d.i({style: {
        display: 'inline-block',
        float: 'right',
        height: '30px',
        fontSize: 'x-large',
        lineHeight: '30px',
        paddingRight: '10px',
        cursor: 'pointer',
        userSelect: 'none'
      },
      onClick: this.onArrowClick,
      className: this.state.isArrowClick ? "fa fa-caret-left" : "fa fa-caret-right"})
    ]
    return d.div({
      style:{
        backgroundColor: COLOR.blue,
        height: '30px',
        textAlign: 'left',
        color: COLOR.white,
        fontSize: '16px',
        fontFamily: 'Helvetica',
        paddingLeft: '10px',
        lineHeight: '30px',
        marginBottom: '10px'
      }
    }, title)
  },
  renderCell: function(element, specificStyle, logo) {
    var style = {
      textAlign: 'center',
      padding: '0 10px'
    }
    var elements = []
    if (logo) {
      elements = [
        React.createElement(Logo, {name: element, float: 'left', margin: '2px 10px 0 0'}),
        TeamInfo.get(element).countryName
      ]
    }
    else {
      elements = [element]
    }
    style = $.extend(true, style, specificStyle)
    return d.td({style: style}, elements)
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
          if (this.state.isArrowClick) {            
            var header = [
              this.renderCell('N°', styleRank),
              this.renderCell('Equipe', stylePseudo),
              this.renderCell('MJ'),
              this.renderCell('V'),
              this.renderCell('N'),
              this.renderCell('D'),
              this.renderCell('DB'),
              this.renderCell('PTS')
            ]
          }
          else {
            var header = [
              this.renderCell('N°', styleRank),
              this.renderCell('Equipe', stylePseudo),
              this.renderCell('MJ'),
              this.renderCell('PTS')
            ]
          }
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
    var styleUsername = {
      textAlign: 'left',
      padding: '0 15px 0 10px'
    }
    var styleGlobalPoint = {
      color: COLOR.dark,
      fontWeight: '600'
    }
    if (ranking.evolution > 0) {
      var color = COLOR.green
    }
    else if (ranking.evolution < 0) {
      var color = COLOR.accent
    }
    var styleEvolution = {
      color: color
    }
    if (this.state.isArrowClick) {
      var elements = [
        this.renderCell(ranking.rank),
        this.renderCell(ranking.name, styleUsername, 'logo'),
        this.renderCell(ranking.round, style),
        this.renderCell(ranking.win, style),
        this.renderCell(ranking.equality, style),
        this.renderCell(ranking.loose, style),
        this.renderCell(ranking.difference, style),
        this.renderCell(ranking.points, styleGlobalPoint)
      ]
    }
    else {      
      var elements = [
        this.renderCell(ranking.rank),
        this.renderCell(ranking.name, styleUsername, 'logo'),
        this.renderCell(ranking.round, style),
        this.renderCell(ranking.points, styleGlobalPoint)
      ]      
    }
    return d.tr({
      style:{
        backgroundColor: COLOR.white,
        height: '25px',
        borderTop: 'solid 1px' + COLOR.gray1,
        textAlign: 'left',
        color: COLOR.black,
        fontSize: '16px',
        fontFamily: 'Helvetica',
        paddingLeft: '10px',
        lineHeight: '25px'
      }    
    }, elements)
  },
  render: function () {
    var elements = [
      this.renderTitle(),
      this.renderDataRanking()
    ]
    if (this.state.isLoading) {
      return d.div({
        style:{
          display: 'inline-block',
          width: '260px',
          padding: '0 40px',
          fontSize: '16px',
          margin: '10px 30px',
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
      }), "Chargement du Classement Ligue 1")
    }
    else {
      var marginLeft = this.state.isArrowClick ? '7px' : '30px'
      return d.div({
        style: {
          verticalAlign: 'middle',
          display: 'inline-block',
          backgroundColor: COLOR.gray1,
          padding: '15px',
          marginLeft: marginLeft,
          borderRadius: '5px',
          boxSizing: 'border-box'
        }
      }, elements)
    }
  }
})