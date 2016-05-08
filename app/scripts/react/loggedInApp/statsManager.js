'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var ColumnChart = require('../core/columnChart')
var LineChart = require('../core/lineChart')
var d = React.DOM

//Composant manager stats
var StatsManager = React.createClass({
  displayName: 'statsManager',
  getInitialState: function() {
    return {isLoading: true, stats: null}
  },
  componentWillMount: function() {
    this.dataStats()
  },
  dataStats: function() {
    var options = {
      url: './api/dataStats.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleDataStats)
  },
  handleDataStats: function(data) {
    this.setState({isLoading: false, stats: data})
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
    }), "Chargement des statistiques")
  },
  render: function() {
    if (this.state.isLoading) {
      var elements = this.isLoading()
    }
    else {
      var dataUserRoundPoints = []
      var currentRound = 0
      for (var round in this.state.stats.userRoundPoints) {
        var value = this.state.stats.userRoundPoints[round]
        var round = parseFloat(value.round)
        if (currentRound < round - 1 && currentRound != 0) {
          for (var i = currentRound + 1; i < round; i++) {
            dataUserRoundPoints.push(['Journée ' + i, 0])
          }
        } 
        currentRound = round
        dataUserRoundPoints.push([round, value.value])
      }
      var dataRound = []
      var dataRank = []
      for (var i = 0; i < this.state.stats.userRank.length; i++) {
        dataRound.push(this.state.stats.userRank[i].round)
        dataRank.push(this.state.stats.userRank[i].rank)
      }
      var elements = [
        React.createElement(ColumnChart, {'data' : dataUserRoundPoints}),
        React.createElement(LineChart, {'dataRound' : dataRound, 'dataRank' : dataRank})
      ]
    }
    return d.div({
      style: {}
    }, elements)
  }
})

module.exports = StatsManager