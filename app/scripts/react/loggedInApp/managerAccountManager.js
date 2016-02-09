'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var ModalAccountManager = require('./accountManager')
var d = React.DOM

//Composant application
var ManagerAccountManager = React.createClass({
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
    this.setState({isLoading: false, dataUser: data.user})
  },
  renderUsername: function() {
    var element = null
    if (this.state.isLoading) {
      element = 'Chargement...'
    }
    else {
      element = this.state.dataUser.pseudo
    }
    return d.div({
      style: {
        color: COLOR.gray4
      }
    }, element)
  },
  render: function() {
    var elements  = [
      this.renderUsername(),
      React.createElement(ModalAccountManager)
    ]
    return d.div({
      style: {}
    }, elements)
  }
})

module.exports = ManagerAccountManager
