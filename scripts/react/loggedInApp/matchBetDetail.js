'use strict'
var d = React.DOM
//Composant détail pari match
var MatchBetDetail = React.createClass({
  getInitialState: function() {
    return {
      bets: [], 
      match: [], 
      users: [], 
      isLoading: true, 
      over: false, 
      domicile: 0, 
      nul: 0, 
      exterieur: 0,
      crossColor: COLOR.blue,
      matchId: this.props.matchId,
      matchMin: 0,
      matchMax: 0
    }
  },
  componentWillMount: function() {
    this.setState({
      matchs: this.props.matchs, 
      matchMin: this.props.matchs[0].matchId, 
      matchMax: this.props.matchs[this.props.matchs.length - 1].matchId
    })
    this.dataMatchBet(this.props.matchId)
  },
  dataMatchBet: function(matchId) {
    var options = {
      url: './api/matchBetCompare.php?matchId=' + matchId,
      method: 'GET',
    }
    this.setState({isLoading: true})
    Ajax.request(options, this.handleMatchBet.bind(this))
  },
  onClose: function() {
    this.props.onClose()
  },
  handleMatchBet: function(data) {
    this.setState({isLoading: false, bets: data.bets, match: data.match, users: data.users})
    this.setState({domicile: 0, exterieur: 0, nul: 0})
    if (data.match.scoreDomicile >= 0) {
      this.setState({over: true})
    }
    if (data.match.scoreDomicile - data.match.scoreExterieur > 0) {
      this.setState({domicile: 1})
    }
    else if (data.match.scoreDomicile - data.match.scoreExterieur < 0) {
      this.setState({exterieur: 1})
    }
    else {
      this.setState({nul: 1})
    }
    var betDomicile = 0
    var betNul = 0
    var betExterieur = 0
    var countBet = data.bets.length
    for (var i = 0; i < data.bets.length; i++) {
      if (data.bets[i].scoreDomicile > data.bets[i].scoreExterieur) {
        betDomicile++
      }
      else if (data.bets[i].scoreDomicile < data.bets[i].scoreExterieur) {
        betExterieur++
      }
      else {
        betNul++
      }
    }
    this.setState({
      percentageDomicile: betDomicile == 0 ? 0 : Math.round(betDomicile * 100 / countBet),
      percentageExterieur: betExterieur == 0 ? 0 : Math.round(betExterieur * 100 / countBet),
      percentageNul: betNul == 0 ? 0 : Math.round(betNul * 100 / countBet)
    })
  },
  renderUserBet: function(index) {
    var userId = this.state.bets[index].userId
    for (var i = 0; i < this.state.users.length; i++) {
      if (this.state.users[i].id == userId) {
        var userPseudo = this.state.users[i].pseudo
        i = this.state.users.length
      }
    }
    return d.div({
      style:{        
        backgroundColor: COLOR.white,
        height: '30px',
        textAlign: 'left',
        color: COLOR.black,
        lineHeight: '30px',
        fontSize: '16px',
        paddingLeft: '10px',
        marginTop: '10px'
      }
    },
    d.div({
      style: {
        display: 'inline-block'
      }
    }, userPseudo),
    d.div({
      style: {
        display: 'inline-block',
      height: '30px',
      float: 'right',
      marginRight: '10px'
      }
    }, React.createElement(RenderBetResult, {match: this.state.match, bet: this.state.bets[index], margin: '0'})))
  },
  renderBetTitle: function() {
    return d.div({
      style:{        
        backgroundColor: COLOR.blue,
        height: '30px',
        textAlign: 'left',
        color: COLOR.white,
        lineHeight: '30px',
        fontSize: '16px',
        paddingLeft: '10px',
        marginTop: '10px'
      }
    }, 'Détail des paris')
  },
  renderStats: function() {
    return d.div({
      style:{        
        backgroundColor: COLOR.white,
        height: '20px',
        textAlign: 'center',
        color: COLOR.black,
        lineHeight: '20px',
        fontSize: '16px',
        padding: '10px 0',
        marginTop: '10px'
      }
    }, 
      React.createElement(barStats, {
        percentage: this.state.percentageDomicile, 
        win: this.state.domicile, 
        over: this.state.over, 
        team: this.state.match.teamDomicile
      }),
      React.createElement(barStats, {
        percentage: this.state.percentageNul, 
        win: this.state.nul, 
        over: this.state.over
      }),
      React.createElement(barStats, {
        percentage: this.state.percentageExterieur, 
        win: this.state.exterieur, 
        over: this.state.over,
        team: this.state.match.teamExterieur
      })
    )
  },
  renderStatsTitle: function() {
    return d.div({
      style:{        
        backgroundColor: COLOR.blue,
        height: '30px',
        textAlign: 'left',
        color: COLOR.white,
        lineHeight: '30px',
        fontSize: '16px',
        paddingLeft: '10px',
        marginTop: '10px'
      }
    }, 'Tendance des joueurs')
  },
  onCrossHover: function(hover) {
    this.setState({crossColor: COLOR.blue})
    if (hover) {
      this.setState({crossColor: COLOR.dark})
    }
  },
  onArrowClick: function(arrow) {
    for (var i = 0; i < this.state.matchs.length; i++) {
      if (this.state.matchs[i].matchId == this.state.matchId) {
        if (arrow == 'left') {
          var matchId = this.state.matchs[i - 1].matchId
        }
        else {
          var matchId = this.state.matchs[i + 1].matchId
        }
        this.setState({matchId: matchId})
        this.dataMatchBet(matchId)
      }
    }
  },
  renderMatchTitle: function(arrowLeft, arrowRight) {
    console.log(arrowLeft, arrowRight)
    var teamDomicile = this.state.match.teamDomicile
    var teamExterieur = this.state.match.teamExterieur
    if (this.state.match.scoreDomicile < 0) {
      var score = ' - '
    }
    else {
      score = this.state.match.scoreDomicile + ' - ' + this.state.match.scoreExterieur
    }
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        height: '40px',
        textAlign: 'center',
        color: COLOR.black,
        lineHeight: '40px',
        fontSize: '16px',
        paddingLeft: '50px'
      }
    },
      d.div({
        style: {
          display: 'inline-block',
          fontSize: '29px',
          padding: '0 20px 0 0',
          display: 'inline-block',
          verticalAlign: 'middle',
          color: arrowLeft ? COLOR.blue : COLOR.white,
          transition: 'color 0.3s',
          cursor: arrowLeft ? 'pointer' : 'auto'
        },
        onClick: arrowLeft ? this.onArrowClick.bind(this, 'left') : null
      }, d.i({className: "fa fa-angle-left"})),
      d.div({
        style: {
          color: COLOR.black,
          display: 'inline-block',
          textAlign: 'right'
        }
      }, 
        TeamInfo.get(teamDomicile).countryName,
        React.createElement(Logo, {name: this.state.match.teamDomicile, float: 'right', margin: '10px 10px'})
      ),
      d.div({
        style: {
          color: COLOR.dark,
          fontWeight: 'bold',
          display: 'inline-block',
          padding: '0 10px'
        }
      }, score),
      d.div({
        style: {
          color: COLOR.black,
          display: 'inline-block',
          textAlign: 'left'
        }
      }, 
        TeamInfo.get(teamExterieur).countryName,
        React.createElement(Logo, {name: this.state.match.teamExterieur, float: 'left', margin: '10px 10px'})
      ),
      d.div({
        style: {
          display: 'inline-block',
          fontSize: '29px',
          padding: '0 0 0 20px',
          display: 'inline-block',
          verticalAlign: 'middle',
          color: arrowRight ? COLOR.blue : COLOR.white,
          transition: 'color 0.3s',
          cursor: arrowRight ? 'pointer' : 'auto'
        },
        onClick: arrowRight ? this.onArrowClick.bind(this, 'right') : null
      }, d.i({className: "fa fa-angle-right"})),
      d.div({
        style: {
          display: 'inline-block',
          color: this.state.crossColor,
          transition: 'color 0.3s',
          float: 'right',
          paddingRight: '10px',
          cursor: 'pointer'
        },
        onClick: this.onClose,
        onMouseOver: this.onCrossHover.bind(this, true),
        onMouseOut: this.onCrossHover.bind(this, false)
      }, d.i({className: "fa fa-times"}))
    )
  },
  render: function() {
    var elements =[]
    var arrowRight = this.state.matchId == this.state.matchMax ? 0 : 1
    var arrowLeft = this.state.matchId == this.state.matchMin ? 0 : 1
    if (this.state.isLoading) {
      elements = ['Chargement']
    }
    else {
      elements = [
        this.renderMatchTitle(arrowLeft, arrowRight),
        this.renderStatsTitle(),
        this.renderStats(),
        this.renderBetTitle()
      ]
    }
    for (var i = 0; i < this.state.bets.length; i++) {
      elements.push(this.renderUserBet(i))
    }
    return d.div({
      style: {
        display: 'inline-block',
        width: '560px',
        backgroundColor: COLOR.gray1,
        borderRadius: '5px'
      }
    }, elements)
  }
})
'use strict'
var d = React.DOM
//Composant barre de statistique
var barStats = React.createClass({
  renderPercentage: function() {
    return d.div({
      style: {
        display: 'inline-block',
        height: '20px',
        width: '20px',
        margin: '10px 10px',
        float: 'right'
      }
    }, this.props.percentage + '%')
  },
  renderLogo: function() {
    var element = null
    if (this.props.team) {
      element = React.createElement(Logo, {name: this.props.team, float: 'left', margin: '10px 10px'})
    }
    else {
      element = 
      d.div({
        style: {
          display: 'inline-block',
          height: '20px',
          width: '20px',
          margin: '10px 10px 10px 0',
          float: 'left'
        }
      }, 'Nul')
    }
    return d.div({
      style: {
        display: 'inline-block'
      }
    }, element)
  },
  renderBorderLeft: function() {
    var color = COLOR.gray1
    if (this.props.percentage > 0) {
      color = this.props.over ? this.props.win ? COLOR.green : COLOR.accent : COLOR.blue
    }
    return d.div({
      style: {
        display: 'inline-block',
        width: '10px',
        height: '20px',
        borderRadius: '10px 0 0 10px',
        backgroundColor: color,
        marginBottom: '10px'
      }
    })
  },
  renderCore1: function() {    
    var color = COLOR.gray1
    if (this.props.percentage > 0 && this.props.percentage < 100) {
      var width = this.props.percentage * 0.7
      color = this.props.over ? this.props.win ? COLOR.green : COLOR.accent : COLOR.blue
    }
    else if (this.props.percentage == 100) {
      width = 70
      color = this.props.over ? this.props.win ? COLOR.green : COLOR.accent : COLOR.blue
    }
    else {
      color = COLOR.gray1
      width = 70
    }
    return d.div({
      style: {
        display: 'inline-block',
        width: width + 'px',
        height: '20px',
        backgroundColor: color,
        marginBottom: '10px'
      }
    })
  },
  renderCore2: function() {    
    var color = COLOR.gray1
    if (this.props.percentage > 0 && this.props.percentage < 100) {
      var width = 70 - this.props.percentage * 0.7
    }
    else {
      width = 0
    }
    return d.div({
      style: {
        display: 'inline-block',
        display: 'inline-block',
        width: width + 'px',
        height: '20px',
        backgroundColor: color,
        marginBottom: '10px'
      }
    })
  },
  renderBorderRight: function() {    
    var color = COLOR.gray1
    if (this.props.percentage == 100) {
      color = this.props.over ? this.props.win ? COLOR.green : COLOR.accent : COLOR.blue
    }
    return d.div({
      style: {
        display: 'inline-block',
        width: '10px',
        height: '20px',
        borderRadius: '0 10px 10px 0',
        backgroundColor: color,
        marginBottom: '10px'
      }
    })
  },
  render: function() {
    var elements = [
      this.renderLogo(),
      this.renderBorderLeft(),
      this.renderCore1(),
      this.renderCore2(),
      this.renderBorderRight(),
      this.renderPercentage()
    ]
    return d.div({
      style: {
        display: 'inline-block',
        margin: '-10px 10px'
      }
    }, elements)
  }
})