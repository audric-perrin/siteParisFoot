'use strict'
var d = React.DOM
//Composant comparaison paris
var MyBetResultManager = React.createClass({
  getInitialState: function() {
    return {user: null, users: [], isLoading: true}
  },
  handleUser: function(data) {
    var userId = data.users[0].id
    this.setState({user: userId, users: data.users, isLoading: false})
  },
  componentWillMount: function() {
    var options = {
      url: './api/listUser.php',
      method: 'GET',
    }
    this.setState({isLoading: true})
    Ajax.request(options, this.handleUser.bind(this))
  },
  renderTitle: function() {
    return d.div({
      style: {
        display: 'inline-block',
        textAlign: 'center',
        color: COLOR.white,
        backgroundColor: COLOR.blue,
        height: '20px',
        lineHeight: '20px',
        padding: '5px 20px',
        marginBottom: '5px',
        borderRadius: '5px'
      }
    }, 'Mes paris')
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
  render: function() {
    var elements = []
    if (this.state.isLoading) {
      elements.push(this.isLoading())
    }
    else {
      elements.push(this.renderTitle())
      elements.push(React.createElement(MyBetResult, {userSelect: this.state.user, round: this.props.round}))
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