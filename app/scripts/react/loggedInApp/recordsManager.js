'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var BoxRecords = require('./boxRecords')
var d = React.DOM

//Composant manager records
var RecordsManager = React.createClass({
  displayName: 'RecordsManager',
  getInitialState: function() {
    return {isLoading: true, dataRankingScoreExact: null}
  },
  componentWillReceiveProps: function() {
    this.dataRankingScoreExact()
  },
  dataRankingScoreExact: function() {
    var options = {
      url: './api/rankingScoreExact.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleRankingScoreExact)
  },
  handleRankingScoreExact: function(data) {
    this.setState({isLoading: true, dataRankingScoreExact: data})
    this.dataRankingResult()
  },
  dataRankingResult: function() {
    var options = {
      url: './api/rankingResult.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleRankingResult)
  },
  handleRankingResult: function(data) {
    this.setState({isLoading: false, dataRankingResult: data})
  },
  isLoading: function() {
    return d.div({
      style: {
        fontSize: '16px',
        marginTop: '10px',
        padding: '15px 0',
        color: COLOR.black,
        backgroundColor: COLOR.white
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
  },
  render: function() {
    if (this.state.isLoading) {
      elements = this.isLoading()
    }
    else {
      var elements = []
      elements.push(React.createElement(BoxRecords, {
        title: 'Meilleur cote score exact', 
        data: this.state.dataRankingScoreExact
      }))
      elements.push(React.createElement(BoxRecords, {
        title: 'Meilleur cote résultat', 
        data: this.state.dataRankingResult
      }))
    }
    return d.div({
      style: {}
    }, elements)
  }
})

module.exports = RecordsManager