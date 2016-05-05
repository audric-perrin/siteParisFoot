'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var ColumnChart = require('./columnChart')
var d = React.DOM

//Composant manager records
var StatsManager = React.createClass({
  displayName: 'statsManager',
  getInitialState: function() {
    return {isLoading: true, records: []}
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
      var elements = this.isLoading()
    }
    // else {
    //   var elements = []
    //   for (var i = 0; i < this.state.records.length; i++) {      
    //     elements.push(React.createElement(BoxRecords, {
    // }
    return d.div({
      style: {}
    }, elements)
  }
})

module.exports = StatsManager