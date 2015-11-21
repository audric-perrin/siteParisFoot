'use strict'
var d = React.DOM
//Composant mon paris
var MyBet = React.createClass({
  render: function() {
  var nameResult = this.props.nameResult !== 'Nul' ? TeamInfo.get(this.props.nameResult).littleName : 'NUL'
  var coteResult = '(' + CoteNumber.format(this.props.coteResult) + ')'
  var nameScore = this.props.nameScore
  var coteScore = '(' + CoteNumber.format(this.props.coteScore) + ')'
  var elementIcone = this.props.nameResult == 'Nul' ? 
  d.i({
    style: {
      display: 'inline-block',
      height: '20px',
      width: '20px',
      margin: '8px 4px',
      lineHeight: '20px',
      fontSize: '10px',
      float: 'left'
    },
    className: "fa fa-minus"}) : 
  React.createElement(Logo, {name: this.props.nameResult, float: 'left', margin: '8px 4px'})
  var elements = [
    d.div({style: {
        display: 'inline-block',
        width: '45px',
        marginRight: '2px',
        fontSize: '14px',
        color: COLOR.gray4,
        float: 'left'
      }
    }, coteResult),
    elementIcone,
    d.div({
      style: {
        display: 'inline-block',
        color: COLOR.black,
        margin: '0 2px 0 2px',
        width: '45px',
        fontSize: '14px',
        float: 'left'
      }
    }, nameResult),
    d.div({style: {
        display: 'inline-block',
        color: COLOR.dark,
        marginRight: '10px',
        fontSize: '14px'
      }
    }, nameScore),
    d.div({style: {
        display: 'inline-block',
        fontSize: '14px',
        color: COLOR.gray4
      }
    }, coteScore) 
  ]
    return d.div({
      style: {}
    }, elements)
  }
})