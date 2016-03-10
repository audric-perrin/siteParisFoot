'use strict'

var Ajax = require('../../utils/ajax')
var ButtonToolbar = require('./toolbar')
var COLOR = require('../../utils/style')
var BlocBet = require('./blocBet')
var BlocResult = require('./blocResult')
var RankingManager = require('./rankingManager')
var MatchStats = require('./matchStats')
var Rules = require('./rules')
var ModalMatchStats = require('./matchStats')
var AccountManager = require('./accountManager')
var ManagerAccountManager = require('./managerAccountManager')
var d = React.DOM

//Composant application
var LoggedInApp = React.createClass({
  displayName: 'LoggedInApp',
  getInitialState: function() {
    return {isClick: 'Pariez', notificationBet: null}
  },
  componentWillMount: function() {
    this.dataNotification()
  },
  componentWillReceiveProps: function() {
    this.dataNotification()
  },
  dataNotification: function() {
    var options = {
      url: './api/notification.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleNotication)
  },
  handleNotication: function(data) {
    this.setState({notificationBet: data.notificationBet})
  },
  onSelectChange: function(name) {
    this.setState({isClick: name})
    this.dataNotification()
  },
  onBet: function() {
    this.dataNotification()
  },
  banner: function() {
    var accountManagerStyle = {width: 250, marginRight: 14}
    return d.div({},
      d.div({
        style: {
          display: 'inline-block',
          height: '90px',
          width: '500px',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundImage: 'url(./images/bannerBetChallenger.png)',
          backgroundPosition: 'center center'
        }
      }),
      d.div({
        style: {
          float: 'right',
          width: accountManagerStyle.width,
          textAlign: 'right',
          marginTop: 10,
          marginRight: accountManagerStyle.marginRight,
          marginLeft: -(accountManagerStyle.width + accountManagerStyle.marginRight)
        }
      }, React.createElement(ManagerAccountManager))
    )
  },
  toolbar: function() {
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        margin: '0 0 15px 0',
        padding: '1px 0 7px 0',
        textAlign: 'center',
        borderTop: 'solid 2px ' + COLOR.gray3,
        borderBottom: 'solid 2px ' + COLOR.gray3
      }
    },
      React.createElement(ButtonToolbar, {
        icone: "fa fa-futbol-o",
        name: 'Pariez',
        selected: this.state.isClick == 'Pariez',
        onClick: this.onSelectChange,
        notification: this.state.notificationBet
      }),
      React.createElement(ButtonToolbar, {
        icone: "fa fa-calendar-check-o",
        name: 'Résultats',
        selected: this.state.isClick == 'Résultats',
        onClick: this.onSelectChange
      }),
      React.createElement(ButtonToolbar, {
        icone: "fa fa-list-ol",
        name: 'Classement',
        selected: this.state.isClick == 'Classement',
        onClick: this.onSelectChange
      }),
      React.createElement(ButtonToolbar, {
        icone: "fa fa-bar-chart",
        name: 'Statistiques',
        selected: this.state.isClick == 'Statistiques',
        onClick: this.onSelectChange,
        disable: true
      }),
      React.createElement(ButtonToolbar, {
        icone: "fa fa-users",
        name: 'Groupes',
        selected: this.state.isClick == 'Groupes',
        onClick: this.onSelectChange,
        disable: true
      }),
      React.createElement(ButtonToolbar, {
        icone: "fa fa-trophy",
        name: 'Trophés',
        selected: this.state.isClick == 'Trophés',
        onClick: this.onSelectChange,
        disable: true
      }),
      React.createElement(ButtonToolbar, {
        icone: "fa fa-star-o",
        name: 'Records',
        selected: this.state.isClick == 'Records',
        onClick: this.onSelectChange,
        disable: true
      }),
      React.createElement(ButtonToolbar, {
        icone: "fa fa-balance-scale",
        name: 'Règles',
        selected: this.state.isClick == 'Règles',
        onClick: this.onSelectChange
      }))
  },
  render: function() {
    var element = null
    var isClick = this.state.isClick
    if (isClick == 'Pariez') {
      element = React.createElement(BlocBet, {onBet: this.onBet})
    }
    if (isClick == 'Résultats') {
      element = React.createElement(BlocResult)
    }
    if (isClick == 'Classement') {
      element = React.createElement(RankingManager)
    }
    if (isClick == 'Statistiques') {
      element = 'React.createElement(Stats)'
    }
    if (isClick == 'Règles') {
      element = React.createElement(Rules)
    }
    if (isClick == 'Records') {
      element = 'React.createElement(Records)'
    }
    if (isClick == 'Trophés') {
      element = 'React.createElement(Trophy)'
    }
    if (isClick == 'Groupes') {
      element = 'React.createElement(Groups)'
    }
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        textAlign: 'center',
        padding: ' 0 0 15px 0'
      }
    }, this.banner(), this.toolbar(), element)
  }
})

module.exports = LoggedInApp
