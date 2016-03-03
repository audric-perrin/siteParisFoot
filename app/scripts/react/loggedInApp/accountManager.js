'use strict'

var COLOR = require('../../utils/style')
var Ajax = require('../../utils/ajax')
var SessionManager = require('../../utils/sessionManager')
var MyButton = require('../core/button')
var Modal = require('../core/modal')
var d = React.DOM

//Modal account manager
var ModalAccountManager = React.createClass({
  displayName: 'ModalAccountManager',
  getInitialState: function() {
    return {showModal: false}
  },
  showModal: function() {
    this.setState({showModal: true})
  },
  hideModal: function() {
    this.setState({showModal: false})
  },
  render: function() {
    return d.div(null,
      d.div({
        style: {},
        onClick: this.showModal
      },
        d.i({className: "fa fa-cog"})
      ),
      React.createElement(Modal, {
        shown: this.state.showModal,
        onClose: this.hideModal,
        renderModalClose: function() {return null},
        width: '392px'
      },
        React.createElement(AccountManager, {onClose: this.hideModal})
      )
    )
  }
})

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
      password: '',
      confirm: '',
      saveLoading: false,
      error: null,
      crossHover: false
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
      this.setState({onEditClick: null, email: '', pseudo: '', username: '', password: '', confirm: '', error: ''})
    }
    else {
      var that = this
      setTimeout(function() {
        if (stateName == 'password') {
          that.refs.confirm.focus()
        }
        else {
          that.refs[stateName].focus()
        }
      }, 300)
      this.setState({onEditClick: stateName, email: '', pseudo: '', username: '', password: '', confirm: '', error: ''})
    }
  },
  onSaveClick: function(stateName, confirm) {
    this.setState({saveLoading: true})
    var data = {}
    data[stateName] = this.state[stateName]
    if (confirm) {
      data['confirm'] = this.state['confirm']
    }
    var options = {
      url: './api/dataUser.php',
      method: 'POST',
      data: data
    }
    var editCallBack = function(data) {
      if (data.result == 'ok') {
        this.setState({email: '', pseudo: '', username: '', password: '', confirm: '', error: ''})
      }
      else {
        this.setState({error: data.result})
      }
      this.dataUser()
    }
    Ajax.request(options, editCallBack.bind(this))
  },
  onValueChange: function(stateName, confirm) {
    var newState = {}
    if (confirm) {
      newState['confirm'] = this.refs['confirm'].value
    }
    else {
      newState[stateName] = this.refs[stateName].value
    }
    this.setState(newState)
  },
  renderBloc: function(title, stateName, confirm, placeholder) {
    var elementDescription = null
    var elementEdit = null
    var elementEditPassword = null
      elementDescription = d.div({
        key: 'elementDescription',
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
            paddingLeft: '5px',
            textAlign: 'center'
          },
        }, title),
        d.div({
          style: {
            display: 'inline-block',
            backgroundColor: COLOR.white,
            lineHeight: '40px',
            textAlign: 'left',
            width: '200px',
            marginRight: '5px',
            paddingLeft: '5px'
          }
        }, confirm ? '******' : this.state.dataUser[stateName]),
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
      if (confirm) {
        elementEditPassword = d.div({
          key: 'elementEditPassword',
          style: {
            textAlign: 'left',
            marginTop: '5px',
            marginBottom: '5px'
          }
        },
          d.input({
            ref: 'confirm',
            type: 'password',
            name: 'confirm',
            value: this.state['confirm'],
            placeholder: placeholder,
            onChange: this.onValueChange.bind(this, stateName, true),
            tabIndex: -1,
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
          })
        )
      }
      elementEdit = d.div({
        key: 'elementEdit',
        style: {
          textAlign: 'left'
        }
      },
        d.input({
          ref: stateName,
          type: confirm ? 'password' : 'text',
          name: stateName,
          value: this.state[stateName],
          placeholder: confirm ? 'Confirmer votre nouveau mot de passe...' : placeholder,
          onChange: this.onValueChange.bind(this, stateName, false),
          tabIndex: -1,
          style: {
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
          onClick: this.onSaveClick.bind(this, stateName, confirm),
          disabled: this.state[stateName] == '' ? true : false
        }, d.i({className: this.state.saveLoading ? "fa fa-spinner fa-pulse" : "fa fa-floppy-o"})
      )
    )
    var height = '40px'
    if (this.state.onEditClick == stateName) {
      if (confirm){
        height = '140px'
      }
      else {
        height = '90px'
      }
    }
    var elements = []
    elements.push(elementDescription)
    if (confirm) {
      elements.push(elementEditPassword)
    }
    elements.push(elementEdit)
    return d.div({
      style: {
        overflowY: 'hidden',
        height: height,
        transition: 'all 300ms',
        marginBottom: '5px'
      }
    }, elements)
  },
  onDeconnexion: function() {
    SessionManager.deconnexion()
  },
  renderButtonDeconnexion: function() {
    return d.div({
      style: {
        textAlign: 'center'
      }
    }, React.createElement(MyButton, {
        style: {
          marginTop: '10px',
          fontSize: '16px',
          height: '35px',
          lineHeight: '35px',
          boxSizing: 'border-box',
          padding: '0px',
          width: '180px'
        },
        color: COLOR.white,
        hoverColor: COLOR.white,
        backgroundColor: COLOR.accent,
        hoverBackgroundColor: COLOR.darkAccent,
        onClick: this.onDeconnexion
      }, 'Déconnexion')
    )
  },
  renderTitle: function() {
    return d.div({
      style: {
        display: 'inline-block',
        backgroundColor: COLOR.blue,
        color: COLOR.white,
        height: '40px',
        lineHeight: '40px',
        paddingLeft: '5px',
        textAlign: 'center',
        width: '310px',
        margin: '0 10px 5px 0'
      }
    }, 'Gestion de compte')
  },
  crossHover: function(hover) {
    this.setState({crossHover: hover})
  },
  renderCross: function() {
    return d.div({
      style: {
        display: 'inline-block',
        color: this.state.crossHover ? COLOR.dark : COLOR.blue,
        transition: 'color 0.3s',
        paddingLeft: '10px',
        cursor: 'pointer'
      },
      onClick: this.props.onClose,
      onMouseOver: this.crossHover.bind(this, true),
      onMouseOut: this.crossHover.bind(this, false)
    }, d.i({className: "fa fa-times"}))
  },
  render: function() {
    if (this.state.isLoading) {
      var element = 'Chargement'
    }
    else {
      var element = d.span(null,
        this.renderTitle(),
        this.renderCross(),
        this.renderBloc('Pseudo', 'pseudo', false, 'Entrer votre nouveau pseudo...'),
        this.renderBloc('Mot de passe', 'password', true, 'Entrer votre nouveau mot de passe...'),
        this.renderBloc('Email', 'email', false, 'Entrer votre nouvel email...'),
        this.renderBloc('Identifiant', 'username', false, 'Entrer votre nouvel identifiant...'),
        this.renderButtonDeconnexion()
      )
      if (this.state.error) {
        var elementError = d.div({
          style: {
            color: COLOR.accent,
            marginTop: '10px'
          }
        }, this.state.error)
      }
    }
    return d.div({
      style: {
        display: 'inline-block',
        height: '100%',
        backgroundColor: COLOR.gray1,
        padding: '15px',
        borderRadius: '5px',
        textAlign: 'left'
      }
    }, element, elementError)
  }
})

module.exports = ModalAccountManager
