'use strict'
var d = React.DOM
//Composant application
var LoggedInApp = React.createClass({
  getInitialState: function() {
    return {isClick: 'Pariez', notificationBet: null, bet: false}
  },
  componentWillMount: function() {
    this.dataNotification()
  },
  dataNotification: function() {
    var options = {
      url: './api/notification.php',
      method: 'GET',
    }
    $.ajax(options).done(this.handleNotication)
  },
  handleNotication: function(data) {
    this.setState({notificationBet: data.notificationBet, bet: false})
  },
  onSelectChange: function(name) {
    this.setState({isClick: name})
    this.dataNotification()
  },
  onBet: function() {
    console.log('onbet')
    this.setState({bet: true})
    this.dataNotification()
  },
  banner: function() {
    return d.div({
      style: {
        height: '90px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(./images/bannerParionsLigue1.png)',
        backgroundPosition: 'center center'
      }
    })
  },
  toolbar: function() {
    var elements = [
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
        onClick: this.onSelectChange
      }),
      React.createElement(ButtonToolbar, {
        icone: "fa fa-trophy",
        name: 'Trophés',
        selected: this.state.isClick == 'Trophés',
        onClick: this.onSelectChange,
        notification: 2
      }),
      React.createElement(ButtonToolbar, {
        icone: "fa fa-star-o",
        name: 'Records',
        selected: this.state.isClick == 'Records',
        onClick: this.onSelectChange,
        notification: 1
      }),
      React.createElement(ButtonToolbar, {
        icone: "fa fa-balance-scale",
        name: 'Règles',
        selected: this.state.isClick == 'Règles',
        onClick: this.onSelectChange
      })
    ]
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        margin: '15px 0',
        padding: '5px 0',
        textAlign: 'center',
        borderTop: 'solid 2px ' + COLOR.gray3,
        borderBottom: 'solid 2px ' + COLOR.gray3
      }
    }, elements)
  },
  render: function() {
    var element = null
    var isClick = this.state.isClick
    if (isClick == 'Pariez') {
      element = React.createElement(BetTable, {onBet: this.onBet})
    }
    if (isClick == 'Résultats') {
      element = React.createElement(Result)
    }
    if (isClick == 'Classement') {
      element = 'React.createElement(Ladder)'
    }
    if (isClick == 'Statistiques') {
      element = 'React.createElement(Stats)'
    }
    if (isClick == 'Règles') {
      element = 'React.createElement(Rules)'
    }
    if (isClick == 'Records') {
      element = 'React.createElement(Records)'
    }
    if (isClick == 'Trophés') {
      element = 'React.createElement(Trophy)'
    }
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        textAlign: 'center',
        padding: '15px 0'
      }
    }, this.banner(), this.toolbar(), element)
  }
})