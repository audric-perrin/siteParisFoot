'use strict'
var d = React.DOM
//Barre bleu victoire
var BetResultManager = React.createClass({
  getInitialState: function() {
    return {user: null, users: []}
  },
  handleUser: function(data) {
    this.setState({user: data.users[0].id, users: data.users})
  },
  componentWillMount: function() {
    var options = {
      url: './api/listUser.php',
      method: 'GET',
    }
    $.ajax(options).done(this.handleUser)
  },
  onUserChanged: function(newUser) {
    this.setState({user: newUser})
  },
  render: function() {
    return d.div({
      style: {
        verticalAlign: 'middle',
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        padding: '15px',
        marginLeft: '30px',
        borderRadius: '5px',
        boxSizing: 'border-box',
        width: '253px',
      }
    }, 
      React.createElement(UserInput, {user: this.state.user, users: this.state.users, onUserChanged: this.onUserChanged}), 
      React.createElement(MyBetResult, {userSelect: this.state.user, round: this.props.round})
    )
  }
})
//Input user
var UserInput = React.createClass({
  componentWillMount: function() {
    this.setState({users: this.props.users})
  },
  componentDidMount: function() {
    $(this.refs.container.getDOMNode()).chosen({
      disable_search: true,
      width: '200px',
      placeholder_text_single: 'Loading...'
    }).change(this.onChange)
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({users: newProps.users}, this.refreshSelect)
  },
  refreshSelect: function() {
    var select = $(this.refs.container.getDOMNode())
    if (this.props.user) {
      select.val(this.props.user)
    }
    select.trigger('chosen:updated')
  },
  onChange: function(e, data) {
    this.props.onUserChanged(parseFloat(data.selected))
  },
  render: function() {
    console.log(this.state.users)
    var options = []
    for (var i = 0; i < this.state.users.length; i++) {
      var user = this.state.users[i]
      if (user.id == this.props.user){
        options[i] = d.option({value: user.id, selected: 'selected'}, user.username)
      }
      else {
        options[i] = d.option({value: user.id}, user.username)
      }
    }
    return d.div({
      style: {
        paddingBottom: '5px',
        display: 'inline-block',
        margin: '0px 15px',
        fontSize: '16px'
      }
    }, d.select({
      ref: 'container'
    }, options))
  }
})