'use strict'

var DecimalNumber = require('../../utils/DecimalNumber')
var TeamInfo = require('../../utils/TeamInfo')
var COLOR = require('../../utils/style')
var Logo = require('./Logo')
var d = React.DOM

//Composant mon paris
var MyBet = React.createClass({
  displayName: 'MyBet',
  render: function() {
    var nameResult = this.props.nameResult !== 'Nul' ? TeamInfo.get(this.props.nameResult).littleName : 'NUL'
    var coteResult = '(' + DecimalNumber.format(this.props.coteResult) + ')'
    var nameScore = this.props.nameScore
    var coteScore = '(' + DecimalNumber.format(this.props.coteScore) + ')'
    var elementIcone = this.props.nameResult == 'Nul' ?
    d.i({
      key: 'elementIcone',
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
    React.createElement(Logo, {name: this.props.nameResult, key: 'elementLogo', float: 'left', margin: this.props.height ? '5px 4px' : '8px 4px'})
    var colorNameResult = COLOR.black
    var colorCoteResult = COLOR.black
    var colorCoteScore = COLOR.black
    if (this.props.coteResultWin) {
      colorNameResult = COLOR.green
      colorCoteResult = COLOR.black
    }
    else if (this.props.endMatch) {
      colorNameResult = COLOR.accent
      colorCoteResult = COLOR.gray2
    }
    var colorNameScore = COLOR.black
    if (this.props.coteScoreWin) {
      colorNameScore = COLOR.green
      colorCoteScore = COLOR.black
    }
    else if (this.props.endMatch) {
      colorNameScore = COLOR.accent
      colorCoteScore = COLOR.gray2
    }
    var height = '35px'
    if (this.props.height) {
      height = this.props.height
    }
    return d.div({
        style: {
          height: height,
          lineHeight: height
        }
      },
        d.div({style: {
            display: 'inline-block',
            width: '45px',
            marginRight: '2px',
            fontSize: '14px',
            color: colorCoteResult,
            float: 'left'
          }
        }, coteResult),
        elementIcone,
        d.div({
          style: {
            display: 'inline-block',
            color: colorNameResult,
            margin: '0 2px 0 2px',
            width: '45px',
            fontSize: '14px',
            float: 'left'
          }
        }, nameResult),
        d.div({style: {
            display: 'inline-block',
            color: colorNameScore,
            marginRight: '10px',
            fontSize: '14px'
          }
        }, nameScore),
        d.div({style: {
            display: 'inline-block',
            fontSize: '14px',
            color: colorCoteScore
          }
        }, coteScore)
    )
  }
})

module.exports = MyBet
