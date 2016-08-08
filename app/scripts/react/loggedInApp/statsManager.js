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
  extractRound: function() {
    var data = this.state.stats.usersRoundPoints
    var minRound = 38
    var maxRound = 0
    for (var userIndex = 0; userIndex < data.length; userIndex++) {
      var userData = data[userIndex].data
      for (var round in userData) {
        if (round < minRound) {
          minRound = parseFloat(round)
        }
        if (round > maxRound) {
          maxRound = round
        }
      }
    }
    return [minRound, maxRound]
  },
  generateRound: function(min, max) {
    var listRounds = []
    for (var round = min; round <= max; round++) {
      listRounds.push(round)
    }
    return listRounds
  },
  buildData: function(minRound, maxRound, type) {
    if (type == 'points') {
      var data = this.state.stats.usersRoundPoints
    }
    else if (type == 'rank') {
      var data = this.state.stats.usersRank
    }
    var result = []
    var color = [COLOR.blue2, COLOR.gray3, COLOR.accent, COLOR.green]
    for (var userIndex = 0; userIndex < data.length; userIndex++) {
      var userData = data[userIndex].data
      result.push({
        data: this.processDataUserRoundPoints(userData, minRound, maxRound),
        name: data[userIndex].userName,
        color: color[userIndex]
      })
    }
    return result
  },
  processDataUserRoundPoints: function(data, minRound, maxRound) {
    var dataUserRoundPoints = []
    var currentRound = minRound
    for (var round in data) {
      var value = data[round]
      var round = parseFloat(value.round)
      if (currentRound < round - 1) {
        for (var i = currentRound + 1; i < round; i++) {
          dataUserRoundPoints.push(0)
        }
      }
      currentRound = round
      dataUserRoundPoints.push(value.value)
    }
    var extra = maxRound - minRound + 1 - dataUserRoundPoints.length
    for (var round = 0; round < extra; round++) {
      dataUserRoundPoints.push(0)
    }
    return dataUserRoundPoints
  },
  processDataUsersRank: function() {
    var dataRound = []
    var dataRank = []
    for (var i = 0; i < this.state.stats.userRank.length; i++) {
      dataRound.push(this.state.stats.userRank[i].round)
      dataRank.push(this.state.stats.userRank[i].rank)
    }
  },
  render: function() {
    if (this.state.isLoading) {
      var elements = this.isLoading()
    }
    else {
      var round = this.extractRound()
      var roundLabel = this.generateRound(round[0], round[1])
      var elements = [
        React.createElement(ColumnChart, {'data' : this.buildData(round[0], round[1], 'points'), 'rounds' : roundLabel}),
        React.createElement(LineChart, {'data' : this.buildData(round[0], round[1], 'rank'), 'rounds' : roundLabel}),
      ]
    }
    return d.div({
      style: {}
    }, elements)
  }
})

module.exports = StatsManager
