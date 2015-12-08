'use strict'
var d = React.DOM
//Composant selecteur classement
var SelectRanking = React.createClass({
  customeMyButton: function(id, name, dropDown) {
    var backgroundColor = this.props.rankSelected == id ? COLOR.blue : COLOR.white
    var hoverBackgroundColor = this.props.rankSelected == id ? COLOR.dark : COLOR.blue
    var color = this.props.rankSelected == id ? COLOR.white : COLOR.gray3
    var hoverColor = this.props.rankSelected == id ? COLOR.white : COLOR.white
    var button = React.createElement(MyButton, {
      style:{
        borderRadius: '0px',
        padding: '10px 15px',
        margin: '0px 0px 15px 0px',
        boxSizing: 'border-box',
        border: 'none',
        fontSize: '16px',
        width: '16.66%'
      },
      backgroundColor: backgroundColor,
      hoverBackgroundColor: hoverBackgroundColor,
      color: color,
      hoverColor: hoverColor,
      onClick: this.props.onRankChanged.bind(this, id, dropDown)
    }, name)
    return button
  },
  render: function () {
    var elements = [
      this.customeMyButton(1, 'Générale', false),
      this.customeMyButton(2, 'Personnel', false),
      this.customeMyButton(3, 'Saison', true),
      this.customeMyButton(4, 'Demi-Saison', true),
      this.customeMyButton(5, 'Mois', true),
      this.customeMyButton(6, 'Journée', true)
    ]
    return d.div({
      style: {
        backgroundColor: COLOR.gray1,
        borderRadius: '5px',
        textAlign: 'center',
        width: '100%'
      }
    }, elements)
  }
})