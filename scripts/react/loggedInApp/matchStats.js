'use strict'
var d = React.DOM
//Composant match stats
var MatchStats = React.createClass({
  getInitialState: function() {
    return {isLoading: true}
  },
  handleData: function(data) {
    this.setState({isLoading: false, data: data})
  },
  componentWillMount: function() {  
    var options = {
      url: './api/matchStats.php?matchId=' + this.props.matchId,
      method: 'GET',
    }
    Ajax.request(options, this.handleData.bind(this))
  },
  renderLineLegend: function(type, number) {
    var color = null
    if (type == 'Victoire') {
      color = COLOR.green
    }
    else if (type == 'Nul') {
      color = COLOR.gray3
    }
    else {
      color = COLOR.accent
    }
    return d.div({
      style: {
        display: 'inline-block',
        height: '20px',
        fontSize: '12px',
        lineHeight: '20px'
      }
    }, d.div({
      style: {
        display: 'inline-block',
        height: '10px',
        width: '10px',
        paddingtop: '5px',
        marginRight: '5px',
        backgroundColor: color
      }
    }), type + ' (' + number + ')')
  },
  renderLegendPieChart: function(win, nul, loose) {
    var elements = [
      this.renderLineLegend('Victoire', win),
      this.renderLineLegend('Nul', nul),
      this.renderLineLegend('Défaite', loose)
    ]
    return d.div({
      style: {
        display: 'inline-block',
        width: '100px',
        textAlign: 'left',
        float: 'left',
        paddingTop: '45px',
        paddingLeft: '20px'
      }
    }, elements)
  },
  renderTitlePieChart: function(team) {
    var element = 
    team == this.state.data.match.teamDomicile ? 
    TeamInfo.get(team).countryName + " à domicile (saison en cours)" : 
    TeamInfo.get(team).countryName + " à l'exterieur (saison en cours)"
    return d.div({
      style: {    
        backgroundColor: COLOR.blue,
        height: '30px',
        lineHeight: '30px',
        color: COLOR.white
      }
    }, element)
  },
  renderPieChart: function(win, nul, loose) {
    return d.div({
      style: {
        display: 'inline-block'
      }
    }, React.createElement(PieChart, {win: win, nul: nul, loose: loose}))
  },
  renderContentPieChart: function(team) {
    var matchs = null
    if (team == this.state.data.match.teamDomicile) {
      matchs = this.state.data.matchsDomicile
    }
    else {
      matchs = this.state.data.matchsExterieur
    }
    var win = 0
    var nul = 0
    var loose = 0
    var winPercent = 0
    var nulPercent = 0
    var loosePercent = 0
    for (var i = 0; i < matchs.length; i++) {
      var domicile = team == matchs[i].teamDomicile ? true : false
      if (matchs[i].scoreDomicile > matchs[i].scoreExterieur) {
        domicile ? win++ : loose++
      }
      else if (matchs[i].scoreDomicile == matchs[i].scoreExterieur) {
        nul++
      }
      else {
        domicile ? loose++ : win++ 
      }
    }
    var winPercent = win / matchs.length * 100
    var nulPercent = nul / matchs.length * 100
    var loosePercent = loose / matchs.length * 100
    var elements = [
      this.renderLegendPieChart(win, nul, loose),
      this.renderPieChart(winPercent, nulPercent, loosePercent)
    ]
    return d.div({
      style: {
        height: '150px',
        backgroundColor: COLOR.white,
        textAlign: 'left'
      }
    }, elements)
  },
  renderBlocPieChart: function(team) {
    var marginRight = this.state.data.match.teamDomicile == team ? '10px' : 0 
    var elements = [
      this.renderTitlePieChart(team),
      this.renderContentPieChart(team)
    ]
    return d.div({
      style: {
        display: 'inline-block',
        width: '350px',
        marginRight: marginRight,
        marginBottom: '10px'
      }
    }, elements)
  },
  renderMatchHistorical: function(match, type) {
    var teamDomicile = match.teamDomicile
    var teamExterieur = match.teamExterieur
    var score = match.scoreDomicile + ' - ' + match.scoreExterieur
    var color = COLOR.dark
    var domicile = null
    if (type == 'domicile') {    
      if (teamDomicile == this.state.data.match.teamDomicile) {
        var domicile = true
      }
      else {
        domicile = false
      }
    }
    else {
      if (teamDomicile == this.state.data.match.teamExterieur) {
        var domicile = true
      }
      else {
        domicile = false
      }
    }
    if (match.scoreDomicile > match.scoreExterieur) {
      color = domicile ? COLOR.green : COLOR.accent
    }
    else if (match.scoreDomicile == match.scoreExterieur) {
      color = COLOR.gray3
    }
    else {
      color = domicile ? COLOR.accent : COLOR.green
    }
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        height: '30px',
        width: '350px', 
        color: COLOR.black,
        textAlign: 'center',
        lineHeight: '30px',
        fontSize: '16px',
        marginTop: '10px'
      }
    },
      d.div({
        style: {
          color: COLOR.black,
          display: 'inline-block',
          textAlign: 'right',
          width: '120px'
        }
      }, 
        TeamInfo.get(teamDomicile).countryName,
        React.createElement(Logo, {name: teamDomicile, float: 'right', margin: '5px 5px'})
      ),
      d.div({
        style: {
          color: color,
          display: 'inline-block',
          padding: '0 10px',
          fontWeight: 'bold',
          width: '50px'
        }
      }, score),
      d.div({
        style: {
          color: COLOR.black,
          display: 'inline-block',
          textAlign: 'left',
          width: '120px'
        }
      }, 
        TeamInfo.get(teamExterieur).countryName,
        React.createElement(Logo, {name: teamExterieur, float: 'left', margin: '5px 5px'})
      )
    )
  },
  renderMatchHistoricalResult: function(type) {
    var elements = []
    var match = this.state.data.match
    var matchs = type == 'domicile' ? this.state.data.matchsDomicileTeam : this.state.data.matchsExterieurTeam
    for (var i = 0; i < 5; i++) {
      var team = null
      if (type == 'domicile') {
        if (matchs[i].teamDomicile == match.teamDomicile) {
          team = 'domicile'
        }
        else {
          team = 'exterieur'
        }
      }
      else {
        if (matchs[i].teamDomicile == match.teamExterieur) {
          team = 'domicile'
        }
        else {
          team = 'exterieur'
        }
      }
      if (matchs[i].scoreDomicile > matchs[i].scoreExterieur) {
        elements.push(d.span({
          style: {
            fontWeight: 'bold',
            color: team == 'domicile' ? COLOR.green : COLOR.accent
          }
        }, team == 'domicile' ? 'V' : 'D'))
      }
      else if (matchs[i].scoreDomicile == matchs[i].scoreExterieur) {
        elements.push(d.span({
          style: {
            fontWeight: 'bold',
            color: COLOR.gray3
          }
        }, 'N'))
      }
      else {
        elements.push(d.span({
          style: {
            fontWeight: 'bold',
            color: team == 'domicile' ? COLOR.accent : COLOR.green
          }
        }, team == 'domicile' ? 'D' : 'V'))
      }
      elements.push(i <= 3 ? d.span({}, ' / ') : null)
    }
    return d.div({
      style: {
        display: 'inline-block',
        height: '30px',
        lineHeight: '30px',
        width: '350px',
        backgroundColor: COLOR.white
      }
    }, elements)
  },
  renderBlocMatchHistorical: function(type) {
    var marginRight = type == 'domicile' ? '10px' : 0
    var elements = []
    elements.push(this.renderMatchHistoricalResult(type))
    for (var i = 0; i < 5; i++) {      
      var match = type == 'domicile' ? this.state.data.matchsDomicileTeam[i] : this.state.data.matchsExterieurTeam[i]
      elements.push(this.renderMatchHistorical(match, type))
    }
    return d.div({
      style: {
        display: 'inline-block',
        width: '350px',
        marginRight: marginRight,
        marginBottom: '10px'
      }
    }, elements)
  },
  renderTitle: function(text) {
    return d.div({
      style:{        
        backgroundColor: COLOR.blue,
        height: '30px',
        textAlign: 'left',
        color: COLOR.white,
        lineHeight: '30px',
        fontSize: '16px',
        paddingLeft: '10px',
        marginBottom: '10px'
      }
    }, text)
  },
  renderMatch: function(match, score) {
    var teamDomicile = match.teamDomicile
    var teamExterieur = match.teamExterieur
    var fontType = 'normal'
    if (score == 'score') {
      var score = match.scoreDomicile + ' - ' + match.scoreExterieur
      fontType = 'bold'
    }
    else {
      var score = DateFormat.getTime(match.date)
    }
    return d.div({
      style: {
        backgroundColor: COLOR.white,
        height: '40px',
        color: COLOR.black,
        textAlign: 'center',
        lineHeight: '40px',
        fontSize: '16px',
        marginBottom: '10px'
      }
    },
      d.div({
        style: {
          color: COLOR.black,
          display: 'inline-block',
          textAlign: 'right',
          width: '150px'
        }
      }, 
        TeamInfo.get(teamDomicile).countryName,
        React.createElement(Logo, {name: teamDomicile, float: 'right', margin: '10px 10px'})
      ),
      d.div({
        style: {
          color: COLOR.dark,
          display: 'inline-block',
          padding: '0 10px',
          fontWeight: fontType,
          width: '50px'
        }
      }, score),
      d.div({
        style: {
          color: COLOR.black,
          display: 'inline-block',
          textAlign: 'left',
          width: '150px'
        }
      }, 
        TeamInfo.get(teamExterieur).countryName,
        React.createElement(Logo, {name: teamExterieur, float: 'left', margin: '10px 10px'})
      )
    )
  },
  render: function() {
    var elements = []
    if (this.state.isLoading) {
      elements = [
        'Chargement ',
        d.i({className: "fa fa-spinner fa-pulse"})
      ]
    }
    else {
      elements.push(this.renderTitle(DateFormat.getDate(this.state.data.match.date)))
      elements.push(this.renderMatch(this.state.data.match, 'time'))
      elements.push(this.renderTitle('Derniers résultats'))
      elements.push(this.renderBlocMatchHistorical('domicile'))
      elements.push(this.renderBlocMatchHistorical('exterieur'))
      elements.push(this.renderBlocPieChart(this.state.data.match.teamDomicile))
      elements.push(this.renderBlocPieChart(this.state.data.match.teamExterieur))
      elements.push(this.renderTitle('Match aller'))
      var matchAller = this.state.data.matchAller ? this.state.data.matchAller : null
      elements.push(matchAller ? this.renderMatch(matchAller, 'score') : null)
    }
    return d.div({
      style: {
        display: 'inline-block',
        width: '710px',
        backgroundColor: COLOR.gray1,
        borderRadius: '5px',
        padding: '15px 15px 5px 15px'
      }
    }, elements)
  }
})