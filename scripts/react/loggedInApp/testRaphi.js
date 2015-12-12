// 'use strict'
// var d = React.DOM
// //DEBUT COMPOSANT 
// var Bloc = React.createClass({
//   getInitialState: function() {
//     return {boutonSelectionner: 0}
//   },
//   boutonEstClic: function(nombreJoueur) {
//     this.setState({boutonSelectionner: nombreJoueur})
//   },
//   render: function() {
//     var elements = [
//       React.createElement(BlocButton, {boutonEstClic: this.boutonEstClic, boutonSelectionner: this.state.boutonSelectionner}),
//       React.createElement(BlocJoueur, {boutonSelectionner: this.state.boutonSelectionner})
//     ]
//     return d.div({
//       style: {
//         display: 'inline-block'
//       }
//     }, elements)
//   }
// })
// //DEBUT COMPOSANT 
// var BlocButton = React.createClass({
//   render: function() {
//     return d.div({
//       style: {
//         display: 'inline-block'
//       }
//     }, 
//     React.createElement(Button, {
//       texte: '1', 
//       boutonEstClic: this.props.boutonEstClic, 
//       boutonSelectionner: this.props.boutonSelectionner
//     }),    
//     React.createElement(Button, {
//       texte: '2', 
//       boutonEstClic: this.props.boutonEstClic, 
//       boutonSelectionner: this.props.boutonSelectionner
//     }),    
//     React.createElement(Button, {
//       texte: '3', 
//       boutonEstClic: this.props.boutonEstClic, 
//       boutonSelectionner: this.props.boutonSelectionner
//     }),    
//     React.createElement(Button, {
//       texte: '4', 
//       boutonEstClic: this.props.boutonEstClic, 
//       boutonSelectionner: this.props.boutonSelectionner
//     }))
//   }
// })
// //DEBUT COMPOSANT 
// var Button = React.createClass({
//   getInitialState: function() {
//     return {boutonEstClic: false}
//   },
//   componentWillMount: function() {
//     this.setState({boutonEstClic: this.props.boutonSelectionner == this.props.texte ? true : false})
//   },
//   jeClicSurLeBouton: function() {
//     this.props.boutonEstClic(this.props.texte)
//     if (this.state.boutonEstClic) {
//       this.setState({boutonEstClic: false})
//     }
//     else {
//       this.setState({boutonEstClic: true})
//     }
//   },
//   render: function() {
//     var couleurDuBouton = this.state.boutonEstClic ? COLOR.white : COLOR.blue
//     var couleurDuFond = this.state.boutonEstClic ? COLOR.blue : COLOR.white
//     var couleurBordure = this.state.boutonEstClic ? COLOR.blue : COLOR.black
//     return d.div({
//       style: {
//         color: couleurDuBouton,
//         display: 'inline-block',
//         cursor: 'pointer',
//         backgroundColor: couleurDuFond,
//         padding: '5px 15px',
//         margin: '10px',
//         border: 'solid 1px ' + couleurBordure,
//         borderRadius: '5px',
//         transition: 'all 0.7s'
//       },
//       onClick: this.jeClicSurLeBouton
//     }, this.props.texte)
//   }
// })
// //DEBUT COMPOSANT 
// var BlocJoueur = React.createClass({
//   render: function() {
//     var elements = 'Pas de joueur'
//     if (this.props.boutonSelectionner !== 0) {
//       var elements = []
//       for (var i = 1; i <= this.props.boutonSelectionner; i++) {
//         elements.push(React.createElement(Joueur, {numeroJoueur: i}))
//       }
//     }
//     return d.div({
//       style: {
//         display: 'block'
//       }
//     }, elements)
//   }
// })
// //DEBUT COMPOSANT
// var Joueur = React.createClass({
// render: function() {
//     return d.div({
//       style: {
//         display: 'block',
//         backgroundColor: COLOR.white,
//         border: 'solid 1px' + COLOR.black,
//         borderRadius: '5px',
//         padding: '5px 15px',
//         margin: '10px',
//         color: COLOR.black
//       }
//     }, 'Joueur ' + this.props.numeroJoueur)
//   }
// })


