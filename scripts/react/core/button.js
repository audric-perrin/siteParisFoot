'use strict'
var d = React.DOM
//Composant bouton
var MyButton = React.createClass({
  getInitialState: function() {
    return {buttonHover: false, buttonClick: false}
  },
  buttonHover: function(hover) {
    this.setState({buttonHover: hover})
  },
  buttonClick: function() {
    if (this.props.onClick && !this.props.disabled) {
      this.props.onClick()
    }
  },
  render: function() {
    //Variable d'état
    var isHover = this.state.buttonHover
    //Variable props
    var normalColor = this.props.color ? this.props.color : COLOR.white
    var hoverColor = this.props.hoverColor ? this.props.hoverColor : normalColor
    var disabledBackgroundColor = this.props.disabledBackgroundColor ? this.props.disabledBackgroundColor : COLOR.gray2
    var normalBackgroundColor = this.props.backgroundColor ? this.props.backgroundColor : COLOR.primary
    var hoverBackgroundColor = this.props.hoverBackgroundColor ? this.props.hoverBackgroundColor : COLOR.dark
    var normalBorderColor = this.props.borderColor ? this.props.borderColor : normalBackgroundColor
    var hoverBorderColor = this.props.hoverBorderColor ? this.props.hoverBorderColor : hoverBackgroundColor
    var disabledBorderColor = this.props.disabledBorderColor ? this.props.disabledBorderColor : disabledBackgroundColor
    //Variable dépendante d'état
    var color = isHover ? hoverColor : normalColor
    var backgroundColor = isHover ? hoverBackgroundColor : normalBackgroundColor
    backgroundColor = this.props.disabled ? disabledBackgroundColor : backgroundColor
    var borderColor = isHover ? hoverBorderColor : normalBorderColor
    borderColor = this.props.disabled ? disabledBorderColor : borderColor
    //Variable style
    var style = {
      color: color,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      display: 'inline-block',
      textAlign: 'center',
      fontSize: '16px',
      padding: '6px',
      cursor: this.props.disabled ? 'default' : 'pointer',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      userSelect: 'none',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: borderColor,
      borderRadius: '5px',
      transition: 'background-color 0.3s, color 0.3s'
    }
    style = $.extend(true, style, this.props.style)
    return d.div({
      style: style,
      onClick: this.buttonClick, 
      onMouseOver: this.buttonHover.bind(this, true),
      onMouseOut: this.buttonHover.bind(this, false)
    }, this.props.children)
  },
})