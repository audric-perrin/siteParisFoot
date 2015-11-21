'use strict'
var d = React.DOM
//Composant application
var LoggedInApp = React.createClass({
  getInitialState: function() {
    return {isClick: 'Pariez'}
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
  onSelectChange: function(name) {
    this.setState({isClick: name})
  },
  toolbar: function() {
    var elements = [
      React.createElement(ButtonToolbar, {
        icone: "fa fa-futbol-o",
        name: 'Pariez',
        selected: this.state.isClick == 'Pariez',
        onClick: this.onSelectChange,
        notification: 10
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
      element = React.createElement(BetTable)
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
// Composant button toolbar
var ButtonToolbar = React.createClass({
  getInitialState: function() {
    return {buttonHover: false}
  },
  buttonHover: function(hover) {
    this.setState({buttonHover: hover})
  },
  buttonClick: function() {
    if (this.props.onClick) {
      this.props.onClick(this.props.name)
    }
  },
  icone: function(color, icone, number) {
    var element = number > 0 ? this.notification(number) : null
    return d.div({}, element, d.i({
      style: {
        display: 'block',
        color: color,
        fontSize: '28px',
        marginBottom: '5px',
        marginTop: '-10px',
        transition: 'color 0.3s'
      },
      className: icone
    }))
  },
  name: function(color, name) {
    return d.div({
      style: {
        fontSize: '14px',
        color: color,
        transition: 'color 0.3s'
      }
    }, name)
  },
  notification: function(number) {
    return d.div({
      style: {
        backgroundColor: COLOR.accent,
        color: COLOR.white,
        lineHeight: '16px',
        minWidth: '16px',
        borderRadius: '8px',
        display: 'inline-block',
        fontSize: '12px',
        position: 'relative',
        left: '10px',
        padding: '0 3px',
        boxSizing: 'border-box'
      }
    }, number)
  },
  render: function() {
    var color = COLOR.gray3
    if (this.props.selected) {
      color = COLOR.dark
    }
    if (this.state.buttonHover) {
      color = COLOR.dark
    }
    return d.div({
      style: {
        width: '120px',
        display: 'inline-block',
        cursor: 'pointer'
      },
      onClick: this.buttonClick,
      onMouseOver: this.buttonHover.bind(this, true),
      onMouseOut: this.buttonHover.bind(this, false)
    }, this.icone(color, this.props.icone, this.props.notification), this.name(color, this.props.name))
  }
})