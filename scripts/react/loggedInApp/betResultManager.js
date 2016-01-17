'use strict'
var d = React.DOM
//Composant comparaison paris
var BetResultManager = React.createClass({
  getInitialState: function() {
    return {user: null, users: [], isLoading: true, round: null, crossHover: false}
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
    Ajax.request(options, this.handleUser.bind(this))
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
  onCrossHover: function(hover) {
    this.setState({crossHover: this.state.crossHover ? false : true})
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
      onMouseOver: this.onCrossHover,
      onMouseOut: this.onCrossHover
    }, d.i({className: "fa fa-times"}))
  },
  render: function() {
    var elements = [
      React.createElement(UserInput, {
        user: this.state.user, 
        users: this.state.users, 
        onUserChanged: this.onUserChanged
      }),
      this.renderCross()
    ]
    if (this.state.isLoading) {
      elements.push(this.isLoading())
    }
    else {
      elements.push(React.createElement(MyBetResult, {userSelect: this.state.user, round: this.state.round}))
    }
    return d.div({
      style: {
        verticalAlign: 'top',
        display: 'block',
        backgroundColor: COLOR.gray1,
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
        fontSize: '16px'
      }
    }, d.select({
      ref: 'container'
    }, options))
  }
})