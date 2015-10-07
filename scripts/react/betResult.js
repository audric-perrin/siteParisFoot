'use strict'
var d = React.DOM
//dataBet paris
var dataBet = {
  journeeBet: 8,
  matchBet: [
  {
    bet: '1',
    coteBet: 1.65,
    score: '1 - 0',
    coteScore: 3.56
  },
  {
    bet: 'N',
    coteBet: 3.23,
    score: '2 - 2',
    coteScore: 12.64
  },
  {
    bet: '2',
    coteBet: 2.30,
    score: '1 - 2',
    coteScore: 10.32
  },
  {
    bet: '1',
    coteBet: 1.42,
    score: '1 - 0',
    coteScore: 4.25
  },
  {
    bet: '1',
    coteBet: 1.8,
    score: '3 - 2',
    coteScore: 20.53
  },
  {
    bet: 'N',
    coteBet: 3.57,
    score: '1 - 1',
    coteScore: 6.23
  },
  {
    bet: '1',
    coteBet: 1.98,
    score: '3 - 0',
    coteScore: 15.43
  },
  {
    bet: '1',
    coteBet: 3.26,
    score: '2 - 0',
    coteScore: 5.34
  },
  {
    bet: '2',
    coteBet: 2.43,
    score: '0 - 1',
    coteScore: 12.64
  },
  {
    bet: 'N',
    coteBet: 2.43,
    score: '0 - 0',
    coteScore: 5.62
  }
  ]
}
//Paris score
var ScoreBet = React.createClass({
  render: function(){
    return d.div({
      style:{
        display: 'inline-block',
        textAlign: 'left',
        color: COLOR.black,
        fontSize: '18px',
        float: 'right',
        fontFamily: 'Helvetica',
        marginRight: '15px'
      }
    }, dataBet.matchBet[this.props.n].coteScore + ' ( ' + dataBet.matchBet[this.props.n].score + ' ) ')
  } 
})
//Paris 1N2
var Bet1N2 = React.createClass({
  render: function(){
    return d.div({
      style:{
        display: 'inline-block',
        textAlign: 'right',
        color: COLOR.black,
        fontSize: '18px',
        float: 'left',
        fontFamily: 'Helvetica',
        marginLeft: '15px'
      }
    }, dataBet.matchBet[this.props.n].coteBet + ' ( ' + dataBet.matchBet[this.props.n].bet + ' ) ')
  } 
})
//ligne paris
var Bet = React.createClass({
  render: function(){
    return d.div({
      style:{
        backgroundColor: COLOR.white,
        display: 'inline-block',
        height: '50px',
        width: '270px',
        marginTop: '10px',
        textAlign: 'center',
        lineHeight: '50px'
      }
    }, React.createElement(ScoreBet, {n: this.props.n}),
    React.createElement(Bet1N2, {n: this.props.n}))
  } 
})
//Fonction tous les matchs
var resultsBet = []
for (var i = 0; i < dataBet.matchBet.length; i++){
  resultsBet.push (React.createElement(Bet, {n: i}))
}  
//Box titre
var Title = React.createClass({
  render: function(){
    return d.div({
      style:{
        display: 'inline-block',
        width: '270px',
        height: '40px',
        lineHeight: '40px',
        backgroundColor: COLOR.blue,
        marginBottom: '5px',
        color: COLOR.white,
        fontSize: '18px',
        fontFamily: 'Helvetica'
      }
    }, d.div({
      style:{ 
        float: 'left',
        marginLeft: '30px'
      }
    }, '1 N 2'), 
       d.div({
        style:{ 
          float: 'right',
          marginRight: '30px'
        }
      }, 'Score exacte'))
  }
})
//Box des resultat paris
var Box_bet_result = React.createClass({
  render: function(){
    return d.div({
      style:{
        margin: '15px',
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        paddingTop: '15px',
        paddingBottom: '15px',
        width: '300px',
        height: '675px',
        borderRadius: '5px'
      }
    }, React.createElement(Title), resultsBet)
  }
})