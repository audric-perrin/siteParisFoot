'use strict'

var COLOR = require('../../utils/style')
var Ajax = require('../../utils/ajax')
var MyButton = require('../core/button')
var d = React.DOM

//Composant gestion compte
var AccountManager = React.createClass({
  displayName: 'AccountManager',
  getInitialState: function() {
    return {isLoading: true, dataUser: null, onEditClick: false, email: ''}
  },
  componentWillMount: function() {
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
    this.setState({isLoading: false, dataUser: data.user})
  },
  onEdit: function() {
    if (this.state.onEditClick) {
      this.setState({onEditClick: false})
    }
    else {
      this.setState({onEditClick: true})
    }
  },
  onValueChange: function() {
    this.setState({email: this.refs.input.value})
  },
  renderBloc: function() {
    var elementDescription = null
    var elementEdit = null
    if (this.state.dataUser) {    
      elementDescription = d.div({
        style: {
          paddingBottom: '5px'
        }
      },
        d.div({
          style: {
            display: 'inline-block',
            backgroundColor: COLOR.white,
            lineHeight: '40px',
            width: '100px',
            marginRight: '5px',
            paddingLeft: '5px'
          }
        }, 'Email'),
        d.div({
          style: {
            display: 'inline-block',
            backgroundColor: COLOR.white,
            lineHeight: '40px',
            width: '200px',
            marginRight: '5px',
            paddingLeft: '5px'
          }
        }, this.state.dataUser.email),
        React.createElement(MyButton, {
          style: {          
            marginTop: '2.5px',          
            fontSize: '18px',
            width: '40px',
            height: '35px',
            lineHeight: '35px',
            boxSizing: 'border-box',
            padding: '0px'
          },
          color: COLOR.white,
          hoverColor: COLOR.white,
          backgroundColor: COLOR.blue,
          hoverBackgroundColor: COLOR.dark,
          onClick: this.onEdit
        }, d.i({className: this.state.onEditClick ? "fa fa-undo" : "fa fa-pencil-square-o"}))
      )
      elementEdit = d.div({
        style: {
          textAlign: 'left'
        }
      },
        d.input({
          ref: 'input',
          type: 'text',
          name: 'email',
          placeholder: 'Entrer votre nouvel email...',
          onChange: this.onValueChange,
          style:{
            display: 'inline-block',
            backgroundColor: COLOR.white,
            height: '40px',
            width: '315px',
            lineHeight: '40px',
            fontSize: '16px',
            color: COLOR.black,
            outline: 'none',
            border: 'solid 2px' + COLOR.blue,
            boxSizing: 'border-box',
            marginRight: '5px',
            paddingLeft: '5px'
          }
        }),
        React.createElement(MyButton, {
          style: {
            marginTop: '2.5px',          
            fontSize: '18px',
            width: '40px',
            height: '35px',
            lineHeight: '35px',
            boxSizing: 'border-box',
            padding: '0px'
          },
          color: COLOR.white,
          hoverColor: COLOR.white,
          backgroundColor: COLOR.blue,
          hoverBackgroundColor: COLOR.dark,
          onClick: this.onEdit,
          disabled: this.state.email == '' ? true : false
        }, d.i({className: "fa fa-floppy-o"}))
      )
    }
    var height = '40px'
    if (this.state.onEditClick) {
      height = '90px'
    }
    return d.div({
      style: {
        overflowY: 'hidden',
        height: height,
        transition: 'all 300ms'
      }
    }, elementDescription, elementEdit)
  },
  render: function() {
    console.log(this.state)
    if (this.state.isLoading) {
      var element = 'Chargement'
    }
    else {
      var element = this.renderBloc()
    }
    return d.div({
      style: {
        display: 'inline-block',
        height: '100%',
        backgroundColor: COLOR.gray1,
        padding: '15px',
        borderRadius: '5px'
      }
    }, element)
  }
})

module.exports = AccountManager