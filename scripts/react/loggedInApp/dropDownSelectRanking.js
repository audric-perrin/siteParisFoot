'use strict'
var d = React.DOM
//Input user
var DropDownSelectRanking = React.createClass({
  render: function() {
    var options = []
    for (var i = 0; i < this.prop.listDropDown.length; i++) {
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