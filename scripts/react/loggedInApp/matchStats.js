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
    console.log(this.state.data)
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
        padding: '15px'
      }
    }, elements)
  }
})