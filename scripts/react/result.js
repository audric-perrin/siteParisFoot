'use strict'
var d = React.DOM
//Tableau de valeur
var data = {
  journee: 8,
  match: [
  {
    teamDomicile: 'Olympique Lyonnais',
    teamExterieur: 'Stade de Reims',
    scoreDomicile: 3,
    scoreExterieur: 0
  },
  {
    teamDomicile: 'Olympique Marseillais',
    teamExterieur: 'Paris Saint-Germain',
    scoreDomicile: 1,
    scoreExterieur: 3
  },
  {
    teamDomicile: 'Angers SCO',
    teamExterieur: 'Girondins de Bordeaux',
    scoreDomicile: 2,
    scoreExterieur: 2
  },
  {
    teamDomicile: 'FC Lorient',
    teamExterieur: 'OGC Nice',
    scoreDomicile: 1,
    scoreExterieur: 0
  },
  {
    teamDomicile: 'ESTAC Troyes',
    teamExterieur: 'AS Monaco',
    scoreDomicile: 0,
    scoreExterieur: 0
  },
  {
    teamDomicile: 'SC Bastia',
    teamExterieur: 'SM Caen',
    scoreDomicile: 2,
    scoreExterieur: 0
  },
  {
    teamDomicile: 'Montpellier Hérault SC',
    teamExterieur: 'AS Saint-Etienne',
    scoreDomicile: 1,
    scoreExterieur: 2
  },
  {
    teamDomicile: 'Toulouse FC',
    teamExterieur: 'LOSC',
    scoreDomicile: 1,
    scoreExterieur: 1
  },
  {
    teamDomicile: 'Stade Rennais FC',
    teamExterieur: 'GFC Ajaccio',
    scoreDomicile: 1,
    scoreExterieur: 0
  },
  {
    teamDomicile: 'EA Guingamp',
    teamExterieur: 'FC Nantes',
    scoreDomicile: 1,
    scoreExterieur: 3
  }
  ]
}
//Barre bleu victoire
var WinBox = React.createClass({
  render: function (){
    return d.div({
      style:{
        display: 'inline-block',
        height: '50px',
        width: '6px',
        backgroundColor: COLOR.blue,
        verticalAlign: 'middle',
        float: this.props.pos
      }
    })
  }
})
//Equipe domicile
var TeamDomicile = React.createClass({
  render: function(){
    var element = null
    if (data.match[this.props.n].scoreDomicile > data.match[this.props.n].scoreExterieur) {
      element = React.createElement(WinBox, {pos: 'left'})
    }
    console.log(element)
    return d.div({
      style:{
        display: 'inline-block',
        width: '270px',
        textAlign: 'right',
        color: COLOR.black,
        fontSize: '18px',
        float: 'left',
        fontFamily: 'Helvetica'
      }
    }, element, data.match[this.props.n].teamDomicile)
  } 
})
//Score
var Score = React.createClass({
  render: function(){
    return d.div({
      style:{
        display: 'inline',
        color: COLOR.blue,
        fontSize: '18px',
        fontWeight: 'Bold',
        fontFamily: 'Helvetica'
      }
    }, data.match[this.props.n].scoreDomicile, ' - ', data.match[this.props.n].scoreExterieur)
  } 
})
//Equipe exterieur
var TeamExterieur = React.createClass({
  render: function(){
    var element = null
    if (data.match[this.props.n].scoreExterieur > data.match[this.props.n].scoreDomicile) {
      element = React.createElement(WinBox, {pos: 'right'})
    }
    return d.div({
      style:{
        display: 'inline-block',
        width: '270px',
        textAlign: 'left',
        color: COLOR.black,
        fontSize: '18px',
        float: 'right',
        fontFamily: 'Helvetica'
      }
    }, element, data.match[this.props.n].teamExterieur)
  } 
})
//ligne match
var Match = React.createClass({
  render: function(){
    return d.div({
      style:{
        backgroundColor: COLOR.white,
        display: 'inline-block',
        height: '50px',
        width: '700px',
        marginTop: '10px',
        textAlign: 'center',
        lineHeight: '50px'
      }
    }, React.createElement(TeamDomicile, {n: this.props.n}),
       React.createElement(Score, {n: this.props.n}),
       React.createElement(TeamExterieur, {n: this.props.n}))  
  } 
})
//Fonction tous les matchs
var results = []
for (var i = 0; i < data.match.length; i++){
  results.push (React.createElement(Match, {n: i}))
}
//Box journee
var Box_journee = React.createClass({
  getInitialState: function () {
  return {hover: false};
  },
  
  mouseOver: function () {
    this.setState({hover: true});
  },
  
  mouseOut: function () {
    this.setState({hover: false});
  },
  render: function(){
    var color = COLOR.blue
    if (this.state.hover) {
        color = COLOR.blue2
    }
    return d.div({
      onMouseOver: this.mouseOver,
      onMouseOut: this.mouseOut,
      style:{
        display: 'inline-block',
        width: '160px',
        height: '40px',
        lineHeight: '40px',
        backgroundColor: color,
        borderRadius: '5px',
        marginBottom: '5px',
        color: COLOR.white,
        fontSize: '18px',
        outline: 'none',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 700ms',
        fontFamily: 'Helvetica'
      }
    }, 'Journée 8', React.createElement(Icone_journee))
  }
})
//iconeJournee
var Icone_journee = React.createClass({
  render: function(){
    return d.div({
      style:{
        display: 'inline-block',
        fontSize: '20px',
        paddingRight: '15px',
        color: COLOR.white,
        float: 'right'
      }
    }, d.i({className: "fa fa-caret-down"}))
  }
})
//Resultat
var Result = React.createClass({
  render: function(){
    return d.div({
      style:{
        margin: '15px',
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        paddingTop: '15px',
        paddingBottom: '15px',
        width: '730px',
        borderRadius: '5px'
      }
    }, React.createElement(Box_journee), results)
  }
})