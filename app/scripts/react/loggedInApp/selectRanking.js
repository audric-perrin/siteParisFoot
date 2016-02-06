'use strict'

var COLOR = require('../../utils/style')
var MyButton = require('../core/button')
var DropDownSelectRanking = require('./dropDownSelectRanking')
var d = React.DOM

//Composant selecteur classement
var SelectRanking = React.createClass({
  displayName: 'SelectRanking',
  customeMyButton: function(id, name, dropDown) {
    var backgroundColor = this.props.rankSelected == id ? COLOR.blue : COLOR.white
    var hoverBackgroundColor = this.props.rankSelected == id ? COLOR.dark : COLOR.blue
    var color = this.props.rankSelected == id ? COLOR.white : COLOR.gray3
    var hoverColor = this.props.rankSelected == id ? COLOR.white : COLOR.white
    var button = React.createElement(MyButton, {
      style:{
        borderRadius: '0px',
        padding: '10px 15px',
        boxSizing: 'border-box',
        border: 'none',
        fontSize: '16px',
        width: '16.66%'
      },
      backgroundColor: backgroundColor,
      hoverBackgroundColor: hoverBackgroundColor,
      color: color,
      hoverColor: hoverColor,
      onClick: this.props.onRankChanged.bind(null, id, dropDown)
    }, name)
    return button
  },
  componentWillReceiveProps: function(newProps) {
    this.setState({selectedIndex: newProps.dropDownSelected})
  },
  render: function () {
    var height = '36px'
    var dropdown = null
    if (this.props.dropDown) {
      height = '81px'
      dropdown = React.createElement(DropDownSelectRanking, {
        id: this.props.rankSelected,
        metaData: this.props.metaData,
        onChanged: this.props.onDropDownSelectChanged,
        selectedIndex: this.state.selectedIndex
      })
    }
    return d.div({
      style: {
        backgroundColor: COLOR.gray1,
        textAlign: 'center',
        margin: '0px 0px 15px 0px',
        width: '100%',
        transition: 'all 0.3s',
        height: height
      }
    },
      this.customeMyButton('general', 'Général', false),
      this.customeMyButton('personnel', 'Personnel', false),
      this.customeMyButton('saison', 'Saison', true),
      this.customeMyButton('demiSaison', 'Demi-Saison', true),
      this.customeMyButton('month', 'Mois', true),
      this.customeMyButton('round', 'Journée', true),
      dropdown
    )
  }
})

module.exports = SelectRanking
