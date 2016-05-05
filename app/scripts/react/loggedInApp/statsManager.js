'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var ColumnChart = require('./columnChart')
var d = React.DOM

//Composant manager records
var StatsManager = React.createClass({
  displayName: 'statsManager',
  render: function() {
    if (this.state.isLoading) {
      elements = this.isLoading()
    }
    else {
      var elements = []
      for (var i = 0; i < this.state.records.length; i++) {      
        elements.push(React.createElement(BoxRecords, {
          key: i,
          data: this.state.records[i]
        }))
      }
    }
    return d.div({
      style: {}
    }, elements)
  }
})

module.exports = StatsManager