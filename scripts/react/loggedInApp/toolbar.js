'use strict'
var d = React.DOM
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
    var padding = ''
    if (number == 0){
      return null
    }
    if (number < 10){
      padding = '0 0 0 1px'
    }
    else {
      padding = '0 3px'
    }
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
        boxSizing: 'border-box'
      }
    }, number)
  },
  render: function() {
    var color = COLOR.gray3
    var cursor = 'pointer'
    if (this.props.selected) {
      color = COLOR.dark
    }
    if (this.state.buttonHover) {
      color = COLOR.dark
    }
    if (this.props.disable) {
      color = COLOR.gray1
      cursor = 'auto'
    }
    return d.div({
      style: {
        width: '120px',
        display: 'inline-block',
        cursor: cursor
      },
      onClick: this.buttonClick,
      onMouseOver: this.buttonHover.bind(this, true),
      onMouseOut: this.buttonHover.bind(this, false)
    }, this.icone(color, this.props.icone, this.props.notification), this.name(color, this.props.name))
  }
})