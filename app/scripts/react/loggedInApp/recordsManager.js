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
    this.setState({isLoading: false, dataRankingScoreExact: data})
  },
  render: function() {
    if (this.state.isLoading) {
      elements = 'isLoading'
    }
    else {
      var elements = []
      elements.push(React.createElement(BoxRecords, {
        title: 'Meilleur cote score exact', 
        data: this.state.dataRankingScoreExact
      }))
    }
    return d.div({
      style: {}
    }, elements)
  }
})

module.exports = RecordsManager