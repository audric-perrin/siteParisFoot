'use strict'
var d = React.DOM
//Composant selecteur classement
var SelectRanking = React.createClass({
  customeMyButton: function(id, name) {
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
      backgroundColor: COLOR.white,
      hoverBackgroundColor: COLOR.blue,
      color: COLOR.gray3,
      hoverColor: COLOR.white,
      onClick: this.props.onRankChanged.bind(this, id)
    }, name)
    return button
  },
  render: function () {
    var elements = [
      this.customeMyButton(1, 'Générale'),
      this.customeMyButton(2, 'Personnel'),
      this.customeMyButton(3, 'Saison'),
      this.customeMyButton(4, 'Demi-Saison'),
      this.customeMyButton(5, 'Mois'),
      this.customeMyButton(6, 'Journée')
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