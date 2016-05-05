'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var ModalAccountManager = require('./accountManager')
var UserInfo = require('../../utils/userInfo')
var d = React.DOM

//Composant application
var ManagerAccountManager = React.createClass({
  displayName: 'ManagerAccountManager',
  getInitialState: function() {
    return {isLoading: true, dataUser: null}
  },
  componentWillMount: function() {
    this.dataUser()
  },
  componentWillReceiveProps: function() {
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
    UserInfo.initialize(data)
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
        display: 'inline-block',
        color: COLOR.gray4
      }
    }, element)
  },
  onChange: function() {
    this.setState(this.getInitialState())
    this.dataUser()
  },
  render: function() {
    return d.div({
      style: {}
    },
      this.renderUsername(),
      React.createElement(ModalAccountManager, {onClose: this.onChange})
    )
  }
})

module.exports = ManagerAccountManager
