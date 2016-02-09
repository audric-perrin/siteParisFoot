'use strict'

var COLOR = require('../../utils/style')
var Ajax = require('../../utils/ajax')
var MyButton = require('../core/button')
var d = React.DOM

//Composant gestion compte
var AccountManager = React.createClass({
  displayName: 'AccountManager',
  getInitialState: function() {
    return {isLoading: true, dataUser: null}
  },
  componentWillMount: function() {
    this.dataUser()
  },
  dataUser: function() {
    var options = {
      url: './api/dataUser.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleUserInfo)
  },
  handleUserInfo: function(data) {
    this.setState({dataUser: data.user})
  },
  render: function() {
    console.log(this.state)
    return d.div({
      style: {
        height: '100%'
      }
    }, 'test')
  }
})

module.exports = AccountManager