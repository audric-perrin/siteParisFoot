'use strict'
var d = React.DOM
//Création boîte de connection
var Box_login = React.createClass({
  onConnectionClick: function() {
    if (this.props.onConnect) {
      this.props.onConnect()
    }
  },
	render: function() {
		return d.div({
      style:{
        display: 'inline-block',
        width: '330px',
        backgroundColor: COLOR.gray1,
        borderRadius: '5px',
        padding: '15px 15px 0px 15px'
      }
    }, React.createElement(Master_box_input, {text: 'Pseudo', type: 'text', nameIcone: 'fa fa-user'}),
       React.createElement(Master_box_input, {text: 'Password', type: 'password', nameIcone: 'fa fa-lock'}),
       React.createElement(Button_login, {text: 'Connection', onClick: this.onConnectionClick}))
	}
})
//Création boîte d'inscription
var Box_signup = React.createClass({
  render: function() {
    return d.div({
      style:{
        display: 'inline-block',
        width: '330px',
        backgroundColor: COLOR.gray1,
        borderRadius: '5px',
        padding: '15px 15px 0px 15px'
      }
    },  React.createElement(Master_box_input, {text: 'Mail', type: 'text', nameIcone: 'fa fa-envelope'}), 
        React.createElement(Master_box_input, {text: 'Pseudo', type: 'text', nameIcone: 'fa fa-user'}),
        React.createElement(Master_box_input, {text: 'Password', type: 'password', nameIcone: 'fa fa-lock'}),
        React.createElement(Button_login, {text: 'Inscription'}))
  }
})
//Création d'une ligne de saisie
var Master_box_input = React.createClass({
  getInitialState: function(){
    return {focus: false}
  },
  onFocus: function(){
    this.setState({focus: true})
  },
  onBlur: function(){
    this.setState({focus: false})
  },
  render: function() {
    var color = COLOR.gray1
    if (this.state.focus){
      color = COLOR.blue
    }
    return d.div({
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      style:{
        margin: '0px 0px 15px 0px',
        borderRadius: '5px',
        border: 'solid 2px ' + color,
        transition: 'border 300ms'
      }
    },
      React.createElement(Box_input_text, {
        text: this.props.text,
        type: this.props.type,
        nameIcone: this.props.nameIcone
      }))
  }
})
//Création de l'input
var Box_input_text = React.createClass({
  render: function() {
    return d.input({
      type: this.props.type,
      placeholder: this.props.text,
      style:{
        display: 'inline-block',
        width: '250px',
        backgroundColor: COLOR.white,
        borderRadius: '5px 0px 0px 5px',
        padding: '15px',
        color: COLOR.black,
        fontSize: '18px',
        border: 'none',
        outline: 'none',
      }
    }, React.createElement(Icone, {nameIcone: this.props.nameIcone}))
  }
})
//Création de l'icone
var Icone = React.createClass({
  render: function() {
    return d.div({
      style:{
        fontSize: '18px',
        width: '31px',
        paddingRight: '15px',
        display: 'inline-block',
        height: '34px',
        backgroundColor: COLOR.white,
        borderRadius: '0px 5px 5px 0px',
        paddingTop: '16.5px',
        color: COLOR.gray3,
        textAlign: 'right'
      }
    }, d.i({className: this.props.nameIcone}))   
  }
})
// Création du bouton
var Button_login = React.createClass({
  getInitialState: function () {
    return {hover: false};
  },
  
  mouseOver: function () {
    this.setState({hover: true});
  },
  
  mouseOut: function () {
    this.setState({hover: false});
  },
  
  render: function() {
    var color = COLOR.blue
    if (this.state.hover) {
        color = COLOR.blue2
    }
    return d.button({
      onMouseOver: this.mouseOver,
      onMouseOut: this.mouseOut,
      onClick: this.props.onClick,
      style:{
        display: 'inline-block',
        width: '330px',
        backgroundColor: color,
        borderRadius: '5px',
        padding: '15px',
        margin: '0px 0px 15px 0px',
        color: COLOR.white,
        fontSize: '18px',
        textAlign: 'center',
        outline: 'none',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 700ms'
      }
    }, this.props.text)
  }
})