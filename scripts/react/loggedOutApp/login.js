'use strict'
var d = React.DOM
//Création boîte de connection
var Box_login = React.createClass({
  getInitialState: function(){
    return {error: null, username: '', password: '', loading: false}
  },
  onConnectionClick: function() {
    this.setState({loading: true})
    var pseudo = this.state.username
    var password = this.state.password
    var options = {
      url: './api/login.php',
      method: 'POST',
      data: {
        username: pseudo,
        password: password
      }
    }
    var loginCallback = function(data) {
      if (data.result == 'ok') {
        if (this.props.onConnect) {
          this.props.onConnect()
        }
      }
      else {
        this.setState({error: data.result})
      }
      this.setState({loading: false})
    }
    Ajax.request(options, loginCallback.bind(this))
  },
  renderError: function() {
    return d.div({
      style: {        
        color: COLOR.accent,
        paddingBottom: '15px',
        fontSize: '15px'
      }
    }, this.state.error)
  },
  canSubmit: function() {
    var pseudo = this.state.username
    var password = this.state.password
    return pseudo != '' && password != '' && !this.state.loading
  },
  onPseudoChange: function(pseudo) {
    this.setState({username: pseudo})
  },
  onPasswordChange: function(password) {
    this.setState({password: password})
  },
  renderSubmit: function() {
    var element = this.state.loading ? d.i({className: "fa fa-spinner fa-pulse"}) : 'Connexion'
    return d.div({}, element)
  },
  onKeyDown: function(event) {
    if (event.keyCode == 13 && this.canSubmit()) {
      event.preventDefault()
      this.onConnectionClick()
    }
  },
	render: function() {
    var element = [
      React.createElement(Master_box_input,
        {
          text: 'Identifiant',
          type: 'text',
          nameIcone: 'fa fa-user',
          onChange: this.onPseudoChange
        }),
      React.createElement(Master_box_input,
        {
          text: 'Mot de passe',
          type: 'password',
          nameIcone: 'fa fa-lock',
          onChange: this.onPasswordChange
        }),
      React.createElement(MyButton, {
        style:{
          width: '330px',
          padding: '15px',
          margin: '0px 0px 15px 0px',
          boxSizing: 'border-box',
          fontSize: '18px'
        }, 
        onClick: this.onConnectionClick,
        disabled: !this.canSubmit()
      }, this.renderSubmit()),
      d.a({
        style: {
          marginBottom: '15px',
          display: 'inline-block',
          color: this.state.linkHover ? COLOR.dark : COLOR.gray3,
          cursor: 'pointer',
          textDecoration: this.state.linkHover ? 'underline' : 'none'
        },
        onClick: this.props.onSwitch,
        onMouseEnter: (function() {this.setState({linkHover: true})}).bind(this),
        onMouseLeave: (function() {this.setState({linkHover: false})}).bind(this)
      }, 'Inscription')
    ]
    if (this.state.error) {
      element.splice(2, 0, this.renderError())
    }
		return d.div({
      style:{
        display: 'inline-block',
        width: '330px',
        backgroundColor: COLOR.gray1,
        borderRadius: '5px',
        padding: '15px 15px 0px 15px',
        verticalAlign: 'middle'
      },
      onKeyDown: this.onKeyDown.bind(this)
    }, element)
	}
})
//Création boîte d'inscription
var Box_signup = React.createClass({
  getInitialState: function(){
    return {linkHover: false, error: null, username: '', password: '', loading: false}
  },
  onInscriptionClick: function() {
    this.setState({loading: true})
    var pseudo = this.state.pseudo
    var email = this.state.email
    var username = this.state.username
    var password = this.state.password
    var options = {
      url: './api/signup.php',
      method: 'POST',
      data: {
        pseudo: pseudo,
        email: email,
        username: username,
        password: password
      }
    }
    var signupCallback = function(data) {
      if (data.result == 'ok') {
        if (this.props.onSignup) {
          this.props.onSignup()
        }
      }
      else {
        this.setState({error: data.result, fieldError: data.field})
      }
      this.setState({loading: false})
    }
    Ajax.request(options, signupCallback.bind(this))
  },
  renderError: function() {
    return d.div({
      style: {        
        color: COLOR.accent,
        paddingBottom: '15px',
        fontSize: '15px'
      }
    }, this.state.error)
  },
  canSubmit: function() {
    var pseudo = this.state.pseudo
    var email = this.state.email
    var username = this.state.username
    var password = this.state.password
    return pseudo != '' && email != '' && username != '' && password != '' && !this.state.loading
  },
  onPseudoChange: function(pseudo) {
    this.setState({pseudo: pseudo})
  },
  onEmailChange: function(email) {
    this.setState({email: email})
  },
  onUsernameChange: function(username) {
    this.setState({username: username})
  },
  onPasswordChange: function(password) {
    this.setState({password: password})
  },
  renderSubmit: function() {
    var element = this.state.loading ? d.i({className: "fa fa-spinner fa-pulse"}) : 'Inscription'
    return d.div({}, element)
  },
  onKeyDown: function(event) {
    if (event.keyCode == 13 && this.canSubmit()) {
      event.preventDefault()
      this.onInscriptionClick()
    }
  },
  render: function() {
    var element = [
      React.createElement(Master_box_input, {
        text: 'Pseudo', 
        type: 'text', 
        nameIcone: 'fa fa-tag', 
        onChange: this.onPseudoChange,
        error: this.state.fieldError == 'pseudo'
      }),
      React.createElement(Master_box_input, {
        text: 'Mail', 
        type: 'text', 
        nameIcone: 'fa fa-envelope', 
        onChange: this.onEmailChange,
        error: this.state.fieldError == 'email'
      }), 
      React.createElement(Master_box_input, {
        text: 'Identifiant', 
        type: 'text', 
        nameIcone: 'fa fa-user', 
        onChange: this.onUsernameChange,
        error: this.state.fieldError == 'username'
      }),
      React.createElement(Master_box_input, {
        text: 'Mot de passe', 
        type: 'password', 
        nameIcone: 'fa fa-lock', 
        onChange: this.onPasswordChange,
        error: this.state.fieldError == 'password'
      }),
      React.createElement(MyButton, {
        style:{
          width: '330px',
          padding: '15px',
          margin: '0px 0px 15px 0px',
          boxSizing: 'border-box',
          fontSize: '18px'
        }, 
        onClick: this.onInscriptionClick,
        disabled: !this.canSubmit()
      }, this.renderSubmit()),
      d.a({
        style: {
          marginBottom: '15px',
          display: 'inline-block',
          color: this.state.linkHover ? COLOR.dark : COLOR.gray3,
          cursor: 'pointer',
          textDecoration: this.state.linkHover ? 'underline' : 'none'
        },
        onClick: this.props.onSwitch,
        onMouseEnter: (function() {this.setState({linkHover: true})}).bind(this),
        onMouseLeave: (function() {this.setState({linkHover: false})}).bind(this)
      }, 'Connexion')
    ]
    if (this.state.error) {
      element.splice(4, 0, this.renderError())
    }
    return d.div({
      style:{
        display: 'inline-block',
        width: '330px',
        backgroundColor: COLOR.gray1,
        borderRadius: '5px',
        padding: '15px 15px 0px 15px',
        verticalAlign: 'middle'
      },
      onKeyDown: this.onKeyDown.bind(this)
    }, element)
  }
})
//Création d'une ligne de saisie
var Master_box_input = React.createClass({
  getInitialState: function() {
    return {focus: false}
  },
  onFocus: function() {
    this.setState({focus: true})
  },
  onBlur: function() {
    this.setState({focus: false})
  },
  render: function() {
    var color = COLOR.gray1
    if (this.state.focus){
      color = COLOR.primary
    }
    if (this.props.error) {
      color = COLOR.accent
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
        color: color,
        ref: 'boxInput',
        onChange: this.props.onChange,
        text: this.props.text,
        type: this.props.type,
        nameIcone: this.props.nameIcone
      }))
  }
})
//Création de l'input
var Box_input_text = React.createClass({
  componentDidMound: function() {
    this.onValueChange()
  },
  onValueChange: function() {
    if (this.props.onChange){
      this.props.onChange(this.refs.input.getDOMNode().value)
    }
  },
  render: function() {
    return d.input({
      ref: 'input',
      type: this.props.type,
      placeholder: this.props.text,
      onChange: this.onValueChange,
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
    }, React.createElement(Icone, {nameIcone: this.props.nameIcone, color: this.props.color}))
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
        color: this.props.color == COLOR.gray1 ? COLOR.gray3 : this.props.color,
        textAlign: 'right'
      }
    }, d.i({className: this.props.nameIcone}))   
  }
})