'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var BoxRecords = require('./boxRecords')
var UserInfo = require('../../utils/userInfo')
var d = React.DOM

//Composant manager records
var RecordsManager = React.createClass({
  displayName: 'RecordsManager',
  getInitialState: function() {
    return {isLoading: true, records: []}
  },
  componentWillMount: function() {
    this.dataRecords()
  },
  dataRecords: function() {
    var options = {
      url: './api/dataRecords.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleDataRecords)
  },
  handleDataRecords: function(data) {
    this.setState({isLoading: false, records: data})
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
      for (var i = 0; i < this.state.records.length; i++) {      
        elements.push(React.createElement(BoxRecords, {
          key: i,
          data: this.state.records[i],
          dataUser: UserInfo.get()
        }))
      }
    }
    return d.div({
      style: {}
    }, elements)
  }
})

module.exports = RecordsManager