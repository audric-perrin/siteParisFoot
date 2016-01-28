'use strict'
var d = React.DOM
//Composant application
var LoggedInApp = React.createClass({
  getInitialState: function() {
    return {isClick: 'Pariez', notificationBet: null}
  },
  componentWillMount: function() {
    this.dataNotification()
  },
  dataNotification: function() {
    var options = {
      url: './api/notification.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleNotication.bind(this))
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
    return d.div({
      style: {
        height: '90px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(./images/bannerBetChallenger.png)',
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
        onClick: this.onSelectChange,
        disable: false
        // disable: true
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
      })
    ]
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        margin: ' 0 0 15px 0',
        padding: '15px 0 5px 0',
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
      element = React.createElement(BlocBet, {onBet: this.onBet})
    }
    if (isClick == 'Résultats') {
      element = React.createElement(BlocResult)
    }
    if (isClick == 'Classement') {
      element = React.createElement(RankingManager)
    }
    if (isClick == 'Statistiques') {
      element = React.createElement(MatchStats, {matchId: '1202'})
      // element = 'React.createElement(Stats)'
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