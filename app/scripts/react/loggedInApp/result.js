'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var TeamInfo = require('../../utils/TeamInfo')
var DateFormat = require('../../utils/DateFormat')
var Logo = require('../core/logo')
var d = React.DOM

//Barre bleu victoire
var WinBox = React.createClass({
  displayName: 'WinBox',
  render: function () {
    return d.div({
      style:{
        display: 'inline-block',
        height: '30px',
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
  displayName: 'TeamDomicile',
  render: function() {
    var element = null
    if (this.props.match.scoreDomicile > this.props.match.scoreExterieur) {
      element = React.createElement(WinBox, {pos: 'left'})
    }
    return d.div({
      style:{
        display: 'inline-block',
        width: '145px',
        textAlign: 'right',
        color: COLOR.black,
        fontSize: '16px',
        float: 'left',
        fontFamily: 'Helvetica'
      }
    }, element, TeamInfo.get(this.props.match.teamDomicile).countryName)
  }
})

//Score
var Score = React.createClass({
  displayName: 'Score',
  render: function() {
    var element = []
    var fontType = 'normal'
    if (DateFormat.isValid(this.props.match.date) && this.props.match.scoreDomicile < 0) {
      element.push('-')
    }
    else if (this.props.match.scoreDomicile < 0) {
      element.push(DateFormat.getTime(this.props.match.date))
    }
    else {
      element.push(this.props.match.scoreDomicile, ' - ', this.props.match.scoreExterieur)
      fontType = 'bold'
    }
    return d.div({
      style:{
        display: 'inline',
        color: COLOR.blue2,
        fontSize: '16px',
        fontWeight: fontType,
        fontFamily: 'Helvetica'
      }
    }, element)
  }
})

//Equipe exterieur
var TeamExterieur = React.createClass({
  displayName: 'TeamExterieur',
  render: function() {
    var element = null
    if (this.props.match.scoreExterieur > this.props.match.scoreDomicile) {
      element = React.createElement(WinBox, {pos: 'right'})
    }
    return d.div({
      style:{
        display: 'inline-block',
        width: '145px',
        textAlign: 'left',
        color: COLOR.black,
        fontSize: '16px',
        float: 'right',
        fontFamily: 'Helvetica'
      }
    }, element, TeamInfo.get(this.props.match.teamExterieur).countryName)
  }
})

//ligne match
var Match = React.createClass({
  displayName: 'Match',
  render: function() {
    return d.div({
      style:{
        backgroundColor: COLOR.white,
        height: '30px',
        marginTop: '10px',
        textAlign: 'center',
        lineHeight: '30px'
      }
    }, React.createElement(TeamDomicile, {match: this.props.match}),
       React.createElement(Logo, {name: this.props.match.teamDomicile, float: 'left', margin: '5px 10px'}),
       React.createElement(Score, {match: this.props.match}),
       React.createElement(TeamExterieur, {match: this.props.match}),
       React.createElement(Logo, {name: this.props.match.teamExterieur, float: 'right', margin: '5px 10px'}))
  }
})

//ligne date
var LineDate = React.createClass({
  displayName: 'LineDate',
  render: function() {
    var dateScreen = DateFormat.getDate(this.props.match.date)
    if (DateFormat.isValid(this.props.match.date)) {
      dateScreen = 'Date inconnue'
    }
    return d.div({
      style:{
        backgroundColor: COLOR.blue,
        height: '30px',
        marginTop: '10px',
        textAlign: 'left',
        color: COLOR.white,
        fontSize: '16px',
        fontFamily: 'Helvetica',
        paddingLeft: '10px',
        lineHeight: '30px'
      }
    }, dateScreen)
  }
})

//Input round
var RoundInput = React.createClass({
  displayName: 'RoundInput',
  componentDidMount: function() {
    $(this.refs.container).chosen({
      disable_search: true,
      width: '120px',
      placeholder_text_single: 'Loading...'
    }).change(this.onChange)
  },
  componentWillReceiveProps: function(newProps) {
    var select = $(this.refs.container)
    select.val(newProps.round)
    select.trigger('chosen:updated')
  },
  onChange: function(e, data) {
    this.props.onRoundChanged(parseFloat(data.selected), this.props.saison)
  },
  render: function() {
    var options = []
    for (var i = 1; i <= this.props.maxRound; i++) {
      options[i] = d.option({key: i, value: i}, "Journée " + i)
    }
    return d.div({
      style: {
        paddingBottom: '5px',
        display: 'inline-block',
        margin: '0px 15px',
        fontSize: '16px'
      }
    }, d.select({
      ref: 'container',
      value: this.props.round
    }, options))
  }
})

//Input saison
var SaisonInput = React.createClass({
  displayName: 'SaisonInput',
  componentDidMount: function() {
    $(this.refs.container).chosen({
      disable_search: true,
      width: '170px',
      placeholder_text_single: 'Loading...'
    }).change(this.onChange)
  },
  componentWillReceiveProps: function(newProps) {
    var select = $(this.refs.container)
    select.val(newProps.saison)
    select.trigger('chosen:updated')
  },
  onChange: function(e, data) {
    this.props.onSaisonChanged(data.selected)
  },
  render: function() {
    if (this.props.saisons) {    
      var options = []
  // DANGER VALEUR EN DUR (2)
      for (var i = 0; i <= this.props.saisons.length - 1; i++) {
  // DANGER VALEUR EN DUR (2)
        options[i] = d.option({key: i, value: this.props.saisons[i].value}, this.props.saisons[i].label)
      }
    }
    return d.div({
      style: {
        paddingBottom: '5px',
        display: 'inline-block',
        margin: '0px 15px',
        fontSize: '16px'
      }
    }, d.select({
      ref: 'container',
      value: this.props.saison
    }, options))
  }
})

var LoadingBox = React.createClass({
  displayName: 'LoadingBox',
  render: function() {
    return d.div({
      style:{
        fontSize: '16px',
        width: '411px',
        marginTop: '10px',
        padding: '15px 0',
        transition: 'all 0.7s',
        color: COLOR.black,
        backgroundColor: COLOR.white,
        transition: 'all 0.3s',
      }
    }, d.i({
      style: {
        display: 'block',
        fontSize: '40px',
        marginBottom: '5px',
        color: COLOR.gray3
      },
      className: "fa fa-spinner fa-pulse"
    }), this.props.round ? "Chargement journée " + this.props.round : "Chargement")
  }
})

//Resultat
var Result = React.createClass({
  displayName: 'Result',
  getInitialState: function() {
    return {
      matchs: null,
      round: null,
      maxRound: null,
      saison: null,
      currentSaison: null,
      currentRound: null,
      currentMaxRound: null
    }
  },
  changeRound: function (round, saison) {
    this.setState({matchs: null, round: round, saison: saison})
    var options = {
      url: './api/match.php?round=' + round + '&saison=' + saison,
      method: 'GET',
    }
    Ajax.request(options, this.handleMatches)
    if (this.props.handleRound) {
      this.props.handleRound(round, saison)
    }
  },
  changeSaison: function (saison) {
    this.setState({saison: saison})
    var round = null
    if (saison == this.state.currentSaison) {
      round = this.state.currentRound
      this.setState({maxRound: this.state.currentMaxRound})
    }
    else {
      round = 38
      this.setState({maxRound: 38})
    }
    this.changeRound(round, saison)
  },
  handleMatches: function(data) {
    this.setState({matchs: data.match})
  },
  handleSaisons: function(data) {
    this.setState({saisons: data.saison})
  },
  handleCurrentRound: function(data) {
    this.changeRound(data.currentRound, data.currentSaison)
    this.setState({
      currentMaxRound: data.maxRound,
      maxRound: data.maxRound,
      currentSaison: data.currentSaison,
      currentRound: data.currentRound
    })
  },
  componentWillMount: function() {
    var options = {
      url: './api/currentRound.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleCurrentRound)
    var options = {
      url: './api/listSaison.php',
      method: 'GET',
    }
    Ajax.request(options, this.handleSaisons)
  },
  onArrowHoverChange: function(left, hover) {
    var arrow = left ? 'arrowLeft' : 'arrowRight'
    var newState = {}
    newState[arrow] = hover
    this.setState(newState)
  },
  renderArrow: function(left, onClick) {
    var isHover = this.state[left ? 'arrowLeft' : 'arrowRight']
    var padding = left ? '0 0 0 20px' : '0 20px 0 0'
    return d.div({
      key: (left ? 'left' : 'right') + 'Arrow',
      style:{
        fontSize: '29px',
        padding: padding,
        display: 'inline-block',
        verticalAlign: 'middle',
        color: isHover ? COLOR.blue2 : COLOR.blue,
        transition: 'color 0.3s',
        cursor: 'pointer',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        MsUserSelect: 'none',
        userSelect: 'none'
      },
      onClick: onClick,
      onMouseOver: this.onArrowHoverChange.bind(this, left, true),
      onMouseOut: this.onArrowHoverChange.bind(this, left, false)
    }, left ? d.i({className: "fa fa-angle-left"}) : d.i({className: "fa fa-angle-right"}))
  },
  nextRound: function() {
    this.changeRound(this.state.round + 1, this.state.saison)
  },
  previousRound: function() {
    this.changeRound(this.state.round - 1, this.state.saison)
  },
  render: function() {
    var elements = []
    elements.push(React.createElement(SaisonInput, {
      key: 'inputSaison',
      onSaisonChanged: this.changeSaison,
      saisons: this.state.saisons,
      saison: this.state.saison
    }))
    this.state.round == 1 ?
    elements.push(d.div({
      key: 'leftArrow',
      style:{
        display: 'inline-block',
        padding: '5px 0px 5px 34.2969px'}
    })) : 
    elements.push(this.renderArrow(true, this.previousRound))
    elements.push(React.createElement(RoundInput, {
      key: 'inputRound',
      onRoundChanged: this.changeRound,
      round: this.state.round,
      saison: this.state.saison,
      maxRound: this.state.maxRound
    }))
    this.state.round == this.state.maxRound ?
    elements.push(d.div({
      key: 'rightArrow',
      style:{
        display: 'inline-block',
        padding: '5px 34.2969px 5px 0px'}
    })) : 
    elements.push(this.renderArrow(false, this.nextRound))
    if (this.state.matchs) {
      //Fonction tous les matchs
      var results = []
      var actualDate = 0
      for (var i = 0; i < this.state.matchs.length; i++) {
        var match = this.state.matchs[i]
        var mId = match.matchId
        if (actualDate == DateFormat.getDate(match.date)) {
          results.push (React.createElement(Match, {key: mId, match: match}))
        }
        else {
          results.push (
            React.createElement(LineDate, {key: mId + 'lineDate', match: match}),
            React.createElement(Match, {key: mId, match: match}))
          actualDate = DateFormat.getDate(match.date)
        }
      }
      elements.push(results)
    }
    else {
      elements.push(React.createElement(LoadingBox, {key: 'loadingBox', round: this.state.round}))
    }
    return d.div({
      style:{
        width: '433px',
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        padding: '15px',
        borderRadius: '5px'
      }
    }, elements)
  }
})

module.exports = Result
