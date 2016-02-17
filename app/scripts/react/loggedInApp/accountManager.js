'use strict'

var COLOR = require('../../utils/style')
var Ajax = require('../../utils/ajax')
var MyButton = require('../core/button')
var d = React.DOM

//Composant gestion compte
var AccountManager = React.createClass({
  displayName: 'AccountManager',
  getInitialState: function() {
    return {
      isLoading: true,
      dataUser: null,
      onEditClick: [],
      email: '',
      username: '',
      pseudo: '',
      saveLoading: false,
      error: null
    }
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
    this.setState({isLoading: false, dataUser: data.user, saveLoading: false, onEditClick: null})
  },
  onEdit: function(stateName) {
    if (this.state.onEditClick == stateName) {
      this.setState({onEditClick: null, email: '', pseudo: '', username: ''})
    }
    else {
      this.setState({onEditClick: stateName, email: '', pseudo: '', username: ''})
    }
  },
  onSaveClick: function(stateName) {
    this.setState({saveLoading: true})
    var data = {}
    data[stateName] = this.state[stateName]
    var options = {
      url: './api/dataUser.php',
      method: 'POST',
      data: {
        data
      }
    }
    var editCallBack = function(data) {
      if (data.result == 'ok') {
        this.setState({email: '', pseudo: '', username: ''})
      }
      else {
        this.setState({error: data.result})
      }
      this.dataUser()
    }
    Ajax.request(options, editCallBack.bind(this))
  },
  onValueChange: function(stateName) {
    var newState = {}
    newState[stateName] = this.refs[stateName].value
    this.setState(newState)
  },
  renderBloc: function(title, stateName, placeholder) {
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
          },
        }, title),
        d.div({
          style: {
            display: 'inline-block',
            backgroundColor: COLOR.white,
            lineHeight: '40px',
            width: '200px',
            marginRight: '5px',
            paddingLeft: '5px'
          }
        }, this.state.dataUser[stateName]),
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
          onClick: this.onEdit.bind(this, stateName)
        }, d.i({className: this.state.onEditClick == stateName ? "fa fa-undo" : "fa fa-pencil-square-o"}))
      )
      elementEdit = d.div({
        style: {
          textAlign: 'left'
        }
      },
        d.input({
          ref: stateName,
          type: 'text',
          name: stateName,
          value: this.state[stateName], 
          placeholder: placeholder,
          onChange: this.onValueChange.bind(this, stateName),
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
          onClick: this.onSaveClick.bind(this, stateName),
          disabled: this.state[stateName] == '' ? true : false
        }, d.i({className: this.state.saveLoading ? "fa fa-spinner fa-pulse" : "fa fa-floppy-o"}))
      )
    }
    var height = '40px'
    if (this.state.onEditClick == stateName) {
      height = '90px'
    }
    return d.div({
      style: {
        overflowY: 'hidden',
        height: height,
        transition: 'all 300ms',
        marginBottom: '5px'
      }
    }, elementDescription, elementEdit)
  },
  render: function() {
    console.log(this.state)
    if (this.state.isLoading) {
      var element = 'Chargement'
    }
    else {
      var element = [
        this.renderBloc('Email', 'email', 'Entrer votre nouvel email...'),
        this.renderBloc('Identifiant', 'username', 'Entrer votre nouvel identifiant...'),
        this.renderBloc('Pseudo', 'pseudo', 'Entrer votre nouveau pseudo...')
      ]
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
