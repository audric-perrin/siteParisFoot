'use strict'
var d = React.DOM
//Barre bleu victoire
var ManagerComparisonBet = React.createClass({
  getInitialState: function() {
    return {isClick: false}
  },
  onClick: function() {
    this.setState({isClick: true})
  },
  render: function() {
    var elements = [
      React.createElement(MyButton, {
          fontSize: 20,
          onClick: this.onClick,
          style: {
            width: '50px',
            height: '30px',
            boxSizing: 'border-box',
            margin: '14px 0 0 0'
          }
        }, d.i({className: "fa fa-user-plus"})),
      d.div({
        style: {
          display: 'block',
          backgroundColor: COLOR.white,
          borderRadius: '5px',
          padding: '15px',
          margin: '15px'
        }
      }, 'Comparer vos résultats')
    ]
    if (this.state.isClick) {
      elements = React.createElement(BetResultManager, {round: this.props.round, selectIndex: 1})
    }
    return d.div({
      style: {
        verticalAlign: 'top',
        display: 'block',
        backgroundColor: COLOR.gray1,
        height: '100%',
        borderRadius: '5px'
      }
    }, d.div({style: {height: '100%'}}, elements))
  }
})