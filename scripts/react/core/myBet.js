'use strict'
var d = React.DOM
//Composant mon paris
var MyBet = React.createClass({
  render: function() {
  var nameResult = this.props.nameResult !== 'Nul' ? TeamInfo.get(this.props.nameResult).littleName : 'Match nul'
  var coteResult = '(' + this.props.coteResult + ')'
  var nameScore = this.props.nameScore
  var coteScore = '(' + this.props.coteScore + ')'
  var elementIcone = this.props.nameResult == 'Nul' ? null : React.createElement(Logo, {name: this.props.nameResult, float: 'left', margin: '8px 4px'})
  var elements = [
    elementIcone,
    d.div({
      style: {
        display: 'inline-block',
        color: COLOR.dark,
        // marginRight: '2px',
        fontSize: '15px'
      }
    }, nameResult),
    d.div({style: {
        display: 'inline-block',
        // marginRight: '2px',
        fontSize: '14px',
        color: COLOR.gray4
      }
    }, coteResult),
    d.div({style: {
        display: 'inline-block',
        color: COLOR.dark,
        // marginRight: '2px',
        fontSize: '15px'
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