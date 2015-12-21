'use strict'
var d = React.DOM
//Barre bleu victoire
var BetResultManager = React.createClass({
  getInitialState: function() {
    return {user: null, users: [], isLoading: true}
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
    $.ajax(options).done(this.handleUser)
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
        width: '230px',
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
  render: function() {
    var elements = [
      React.createElement(UserInput, {
        user: this.state.user, 
        users: this.state.users, 
        onUserChanged: this.onUserChanged
      }), 
    ]
    if (this.state.isLoading) {
      elements.push(this.isLoading())
    }
    else {
      elements.push(React.createElement(MyBetResult, {userSelect: this.state.user, round: this.props.round}))
    }
    return d.div({
      style: {
        verticalAlign: 'top',
        display: 'block',
        backgroundColor: COLOR.gray1,
        padding: '15px',
        borderRadius: '5px'
      }
    }, elements)
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
    this.setState({
      users: newProps.users,
    }, this.refreshSelect)
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
    var options = []
    for (var i = 0; i < this.state.users.length; i++) {
      var user = this.state.users[i]
      if (user.id == this.props.user){
        options[i] = d.option({value: user.id, selected: 'selected'}, user.pseudo)
      }
      else {
        options[i] = d.option({value: user.id}, user.pseudo)
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