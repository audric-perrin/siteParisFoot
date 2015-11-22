'use strict'
var d = React.DOM
//Barre bleu victoire
var BetResultManager = React.createClass({
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
    }, React.createElement(UserInput, {user: 'me', users: ['me','autre']}), React.createElement(MyBetResult, {userSelect: 'me'}))
  }
})
//Input user
var UserInput = React.createClass({
  componentDidMount: function() {
    $(this.refs.container.getDOMNode()).chosen({
      disable_search: true,
      width: '120px',
      placeholder_text_single: 'Loading...'
    }).change(this.onChange)
  },
  componentWillReceiveProps: function(newProps) {
    var select = $(this.refs.container.getDOMNode())
    select.val(newProps.user)
    select.trigger('chosen:updated')
  },
  onChange: function(e, data) {
    this.props.onUserChanged(parseFloat(data.selected))
  },
  render: function() {
    var options = []
    for (var i = 0; i < this.props.users.lenght; i++) {
      var user = this.props.users[i]
      if (user == this.props.user){
        options[i] = d.option({value: user, selected: 'selected'}, user)
      }
      else {
        options[i] = d.option({value: user}, user)
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