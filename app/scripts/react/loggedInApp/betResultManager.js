'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var MyBetResult = require('./betResult')
var d = React.DOM

//Composant comparaison paris
var BetResultManager = React.createClass({
  displayName: 'BetResultManager',
  getInitialState: function() {
    return {user: null, users: [], isLoading: true, round: null}
  },
  handleUser: function(data) {
    var userId = this.props.selectIndex ? data.users[this.props.selectIndex].id : data.users[0].id
    this.setState({user: userId, users: data.users, isLoading: false})
  },
  componentWillMount: function() {
    var options = {
      url: './api/listUser.php',
      method: 'GET',
    }
    this.setState({isLoading: true})
    Ajax.request(options, this.handleUser)
    this.setState({round: this.props.round})
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.round) {
      this.setState({round: newProps.round})
    }
  },
  onClose: function() {
    this.props.onClose()
  },
  onUserChanged: function(newUser) {
    this.setState({user: newUser})
  },
  isLoading: function() {
    return d.div({
      style: {
        display: 'block',
        padding: '0 40px',
        fontSize: '16px',
        padding: '15px',
        margin: '10px 0px',
        color: COLOR.black,
        backgroundColor: COLOR.white,
      }
      }, d.i({
        style: {
          display: 'block',
          fontSize: '40px',
          marginBottom: '5px',
          color: COLOR.gray3
        },
      className: "fa fa-spinner fa-pulse"
    }), "Chargement des Paris")
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
      onClick: this.onClose,
    }, d.i({className: "fa fa-times"}))
  },
  render: function() {
    var content = null
    if (this.state.isLoading) {
      content = this.isLoading()
    }
    else {
      content = React.createElement(MyBetResult, {
        userSelect: this.state.user,
        round: this.state.round
      })
    }
    var cross = this.props.onClose ? this.renderCross() : null

    return d.div({
      style: {
        verticalAlign: 'top',
        display: 'block',
        backgroundColor: COLOR.gray1,
        borderRadius: '5px'
      }
    },
      React.createElement(UserInput, {
        user: this.state.user,
        users: this.state.users,
        onUserChanged: this.onUserChanged
      }),
      cross,
      content
    )
  }
})

//Input user
var UserInput = React.createClass({
  displayName: 'UserInput',
  componentWillMount: function() {
    this.setState({users: this.props.users})
  },
  componentDidMount: function() {
    $(this.refs.container).chosen({
      disable_search: true,
      width: '185px',
      placeholder_text_single: 'Loading...'
    }).change(this.onChange)
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({
      users: newProps.users,
    }, this.refreshSelect)
  },
  refreshSelect: function() {
    var select = $(this.refs.container)
    if (this.props.user) {
      select.val(this.props.user)
    }
    select.trigger('chosen:updated')
  },
  onChange: function(e, data) {
    this.props.onUserChanged(parseFloat(data.selected))
  },
  render: function() {
    var options = []
    for (var i = 0; i < this.state.users.length; i++) {
      var user = this.state.users[i]
      options[i] = d.option({key: i, value: user.id}, user.pseudo)
    }
    return d.div({
      style: {
        paddingBottom: '5px',
        display: 'inline-block',
        fontSize: '16px'
      }
    }, d.select({
      ref: 'container',
      value: this.props.user,
    }, options))
  }
})

module.exports = BetResultManager
