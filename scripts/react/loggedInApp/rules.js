'use strict'
var d = React.DOM
//Composant application
var Rules = React.createClass({
  renderTitle: function(title) {
    return d.div({
      style: {
        fontSize: '20px',
        margin: '30px 0 10px 0',
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
  renderImage: function(url, height, width) {
    return d.div({
      style: {
        backgroundImage: url,
        height: height,
        width: width,
        backgroundSize: '100% 100%',
        margin: '20px auto'
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
      this.renderTitle('2. Effectuer un pari'),
      this.renderText('Dans l’onglet pariez, vous pouvez sélectionner le résultat du match que vous pronostiquez. Le chiffre indique la cote du résultat associé.'),
      this.renderImage('url(./images/rules1.png)', '158px', '569px'),
      this.renderText('Sélectionner ensuite le score du match. Le chiffre à droite du score indique la cote associée au score.'),
      this.renderImage('url(./images/rules2.png)', '137.5px', '477px'),
      this.renderText('Pour voir tous les scores disponibles cliquer sur la flèche à droite.'),
      this.renderImage('url(./images/rules3.png)', '222px', '477px'),
      this.renderText(d.span(
        null,
        d.span({}, 'Une fois votre pari terminé, cliquer sur valider. '),
        d.span({
          style: {
            fontWeight: 'bold'
          }
        }, 'ATTENTION : une fois le pari validé il n’est pas possible de le modifier.')
      )),
      this.renderImage('url(./images/rules4.png)', '224px', '477px'),
      this.renderText('Lorsqu’un pari est validé, il est affiché à droite de l’intitulé du match. Le pari reste affiché jusqu’au coup de sifflet final du match associé.'),
      this.renderImage('url(./images/rules5.png)', '167.5px', '477px'),
      this.renderTitle('3. Résultat'),
      this.renderText('Dans l’onglet résultat vous pouvez consulter l’issue des matchs de ligue 1 ainsi que les résultats de vos paris. Lorsqu’un pari est correct (résultat ou résultat et score) vous gagnez un nombre de points égale à la/les cote(s) associées.'),
      this.renderImage('url(./images/rules6.png)', '272.5px', '544px'),
      this.renderText(d.span({
        style: {
          fontStyle: 'italic'
        }
      }, 'Dans l’exemple ci-dessus, le parieur a trouvé le bon résultat (victoire équipe domicile), il gagne 2.35 points (valeur de la cote). Le score pronostiqué (2-1) n’est pas correct (résultat réel 1-0), le parieur ne gagne pas de point supplémentaire.')),
      this.renderText(d.br({})),
      this.renderText('Il est également possible de consulter les résultats des paris d’autre joueur.'),
      this.renderImage('url(./images/rules7.png)', '92.5px', '544px'),
      this.renderTitle('4. Classement'),
      this.renderText('Dans l’onglet classement, vous pouvez afficher votre position par rapport aux autres joueurs. Vous pouvez sélectionner différents classements :'),
      this.renderPuce([
        'Général : Prend en compte tous les paris de tous les joueurs.',
        'Personnel : Prend en compte tous les paris effectués après votre premier pari.',
        'Saison : Prend en compte tous les paris de la saison sélectionnée.',
        'Demi-saison : Prend en compte tous les paris de la demi-saison sélectionnée. Une demi-saison est défini par la trêve hivernale (journée 19).',
        'Mois : Prend en compte tous les paris du mois sélectionné.',
        'Prend en compte tous les paris de la journée sélectionnée.'
      ]),
      this.renderImage('url(./images/rules8_2.png)', '226px', '545px'),
      this.renderText('Légende :'),
      this.renderPuce([
        'N° : Position dans le classement',
        'Pseudo : Le pseudo du joueur',
        'MJ : nombre de match où le joueur a effectué un pari',
        '1N2 : nombre de résultat correct trouvé',
        '1N2.PTS : nombre de point gagné avec un résultat correct',
        'Score : nombre de score trouvé',
        'PTS.Score : nombre de point gagné avec un score correct',
        'PTS : nombre de point gagné total'
      ]),
      this.renderText(d.br({})),
      this.renderText('Le classement est défini par rapport au nombre de point total gagnés. En cas d’égalité, le joueur ayant effectué le moins pari passe devant.')
    )
  }
})