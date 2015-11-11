'use strict'
var d = React.DOM
//Composant application
var App = React.createClass({
  getInitialState: function() {
    return {isClick: 'bet'}
  },
  banner: function() {
    return d.div({
      style: {
        height: '50px',
        paddingTop: '15px'
      }
    }, this.logo())
  },
  logo: function() {
    return d.div({
      style: {
        display: 'inline-block',
        height: '50px',
        width: '300px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(./images/bannerParionsLigue1.png)',
        backgroundPosition: 'center center',
      }
    })
  },
  toolbar: function() {
    var elements = [
      React.createElement(ButtonToolbar, {icone: "fa fa-bar-chart", name: 'Statistiques'}),
      React.createElement(ButtonToolbar, {icone: "fa fa-balance-scale", name: 'Règles'})
    ]
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        margin: '15px 0',
        textAlign: 'center',
        height: '60px',
        borderTop: 'solid 2px ' + COLOR.gray3,
        borderBottom: 'solid 2px ' + COLOR.gray3
      }
    }, elements)
  },
  render: function() {
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        margin: 'auto',
        textAlign: 'center',
        width: '1000px'
      }
    }, this.banner(), this.toolbar(), React.createElement(BetTable) )
  }
})
//
  // React.createElement(Result, {initialRound: 13}) 
//
// Composant button toolbar
var ButtonToolbar = React.createClass({
  getInitialState: function() {
    return {buttonHover: false, buttonClick: false}
  },
  buttonHover: function(hover) {
    this.setState({buttonHover: hover})
  },
  buttonClick: function() {
    if (this.props.onClick) {
      this.props.onClick()
    }
  },
  icone: function(color, icone) {
    return d.i({
      style: {
        height: '40px',
        lineHeight: '40px',
        display: 'block',
        color: color,
        fontSize: '22px'
      },
      className: icone
    })
  },
  name: function(color, name) {
    return d.div({
      style: {
        fontSize: '16px',
        height: '20px',
        lineHeight: '20px',
        color: color
      }
    }, name)
  },
  render: function() {
    var color = COLOR.dark
    return d.div({
      style: {
        height: '60px',
        width: '100px',
        display: 'inline-block'
      }
    }, this.icone(color, this.props.icone), this.name(color, this.props.name))
  }
})