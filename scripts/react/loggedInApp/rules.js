'use strict'
var d = React.DOM
//Composant application
var Rules = React.createClass({
  renderTitle: function(title) {
    return d.div({
      style: {
        fontSize: '20px',
        margin: '0 0 10px 0',
        fontWeight: 'bold',
        color: COLOR.blue,
      }
    }, title)
  },
  renderText: function(text) {
    return d.div({
      style: {
        fontSize: '16px',
        color: COLOR.black,
      }
    }, text)
  },
  renderImage: function(url) {
    return d.div({
      style: {
        backgroundImage: url,
        height: '129px',
        width: '473px',
        backgroundSize: '100% 100%',
        margin: '10px auto'
      }
    }, null)
  },
  renderPuce: function(puces) {
    var elements = []
    console.log(puces.lenght)
    for (var i = 0; i < puces.length; i++) {
      elements.push(d.li(null, puces[i]))
    }
    return d.ul({
      style: {
        listStyle: 'initial',
        margin: '0 0 0 45px'
      }
    }, elements)
  },
  render: function() {
    return d.div({
      style: {
        textAlign: 'left',
        margin: '0 150px',
        lineHeight: '20px'
      }
    },
      this.renderTitle('1. Concept'),
      this.renderText('Le principe du site est simple, effectuer des pronostiques sur les matchs de la ligue 1. Sur chaque match vous pouvez effectuer deux types de paris :'),
      this.renderPuce([
        'Pariez sur le résultat du match (victoire équipe domicile ou match nul ou victoire équipe extérieure).',       
        'Pariez sur le score du match.'
      ]),
      this.renderImage('url(./images/rules1.png)')
    )
  }
})