'use strict'

var Ajax = require('../../utils/ajax')
var TeamInfo = require('../../utils/TeamInfo')
var DateFormat = require('../../utils/DateFormat')
var DecimalNumber = require('../../utils/DecimalNumber')
var COLOR = require('../../utils/style')
var MyBet = require('../core/MyBet')
var MyButton = require('../core/button')
var Bloc = require('../core/bloc')
var Logo = require('../core/logo')
var ModalMatchStats = require('./matchStats')

var d = React.DOM

//Composant table paris
var BetTable = React.createClass({
  displayName: 'BetTable',
  getInitialState: function() {
    return {isLoading: true, matchs: null}
  },
  dataBet: function () {
    var options = {
      url: './api/bet.php',
      method: 'GET',
    }
    this.setState({isLoading: true})
    Ajax.request(options, this.handleMatches)
  },
  handleMatches: function(data) {
    var matchs = []
    for (var matchId in data) {
      var match = data[matchId]
      match.id = matchId
      matchs.push(match)
    }
    matchs.sort(function(m1, m2) {
      var date1 = moment.utc(m1.date).unix()
      var date2 = moment.utc(m2.date).unix()
      return date1 - date2
    })
    this.setState({isLoading: false, matchs: matchs})
    if (this.props.onBet) {
      this.props.onBet()
    }
  },
  componentWillMount: function() {
    this.dataBet()
  },
  render: function () {
    if (this.state.isLoading) {
        return d.div({
        style:{
          display: 'inline-block',
          width: '260px',
          padding: '0 40px',
          fontSize: '16px',
          margin: '10px 30px',
          color: COLOR.black,
          backgroundColor: COLOR.white,
        }
      }, d.i({
        style: {
          display: 'block',
          fontSize: '40px',
          marginBottom: '5px',
          color: COLOR.gray3
        },
        className: "fa fa-spinner fa-pulse"
      }), "Chargement des Paris")
    }
    else if (this.state.matchs.length == 0) {
      return d.div({
        style: {
          display: 'inline-block',
          width: '260px',
          padding: '0 40px',
          fontSize: '16px',
          margin: '10px 30px',
          color: COLOR.black,
        }
      }, 'Pas de pari disponible')
    }
    else {
      var elements = []
      for (var i = 0; i < this.state.matchs.length; i++) {
        var renderDate = true
        if (i > 0 && DateFormat.getDate(this.state.matchs[i].date) == DateFormat.getDate(this.state.matchs[i - 1].date)) {
          renderDate = false
        }
        var bet = this.state.matchs[i]
        if (renderDate) {
          elements.push(React.createElement(RenderDate, {key: bet.id + 'date', bet: bet}))
        }
        elements.push(React.createElement(RenderBlocMatch, {key: bet.id, bet: bet, onRefreshRequired: this.handleMatches}))
      }
      return d.div({
        style: {
          display: 'inline-block',
          backgroundColor: COLOR.gray1,
          borderRadius: '5px',
          textAlign: 'center',
          padding: '5px 10px 15px 15px',
          verticalAlign: 'top'
        }
      }, elements)
    }
  }
})

// Composant ligne date
var RenderDate = React.createClass({
  displayName: 'RenderDate',
  render: function() {
    var dateValue = DateFormat.getDate(this.props.bet.date)
    return d.div({
      style:{
        backgroundColor: COLOR.blue,
        height: '35px',
        textAlign: 'left',
        color: COLOR.white,
        paddingLeft: '10px',
        lineHeight: '35px',
        fontSize: '16px',
        margin: '10px 5px 5px 0'
      }
    }, dateValue)
  }
})

//Composant ligne match
var RenderBlocMatch = React.createClass({
  displayName: 'RenderBlocMatch',
  getInitialState: function() {
    return {selectedCoteResult: null, selectedCoteScore: null, validate: false, isLoading: false, allCote: false}
  },
  renderLineMatch: function() {
    var bet = this.props.bet
    var time = DateFormat.getTime(bet.date)
    var matchUpName = [
      TeamInfo.get(bet.teamDomicile).countryName,
      React.createElement(Logo, {key: bet.id + 'logoTeamDomicile', name: bet.teamDomicile, float: 'left', margin: '8px 10px'}),
      ' - ',
      React.createElement(Logo, {key: bet.id + 'logoTeamExterieur', name: bet.teamExterieur, float: 'right', margin: '8px 10px'}),
      TeamInfo.get(bet.teamExterieur).countryName
    ]
    if (bet.bet) {
      var scoreDomicile = parseFloat(bet.bet.scoreDomicile)
      var scoreExterieur = parseFloat(bet.bet.scoreExterieur)
      var coteResult = parseFloat(bet.bet.coteResult)
      var coteScore = parseFloat(bet.bet.coteScore)
      var domicileWin = scoreDomicile > scoreExterieur
      var matchNul = scoreDomicile == scoreExterieur
      var nameScore = scoreDomicile + ' - ' + scoreExterieur
      if (matchNul) {
        var elementsMyBet = React.createElement(MyBet, {
          nameResult: 'Nul',
          coteResult: coteResult,
          nameScore: nameScore,
          coteScore: coteScore
        })
      }
      else if (domicileWin) {
        var elementsMyBet = React.createElement(MyBet, {
          nameResult: bet.teamDomicile,
          coteResult: coteResult,
          nameScore: nameScore,
          coteScore: coteScore
        })
      }
      else {
        var elementsMyBet = React.createElement(MyBet, {
          nameResult: bet.teamExterieur,
          coteResult: coteResult,
          nameScore: nameScore,
          coteScore: coteScore
        })
      }
      var elements = [
        React.createElement(Bloc, {key: bet.id + 'time', width: 'initial', textAlign: 'center', lineHeight: '35px'}, time),
        React.createElement(Bloc, {key: bet.id + 'matchUpName', width: '284px', textAlign: 'center', lineHeight: '35px'}, matchUpName),
        React.createElement(Bloc, {key: bet.id + 'elementsMyBet', width: '210px', textAlign: 'center', lineHeight: '35px'}, elementsMyBet)
      ]
    }
    else {
      var names = [
        bet.teamDomicile,
        'Nul',
        bet.teamExterieur,
      ]
      var cotes = [
        DecimalNumber.format(bet.coteResult.domicile),
        DecimalNumber.format(bet.coteResult.egalite),
        DecimalNumber.format(bet.coteResult.exterieur)
      ]
      var elementsCoteResult = React.createElement(CoteGroupResult, {
        cotes: cotes,
        onChange: this.onCoteResultChange,
        choose: names,
        realCote: cotes,
        buttonStyle: {
          padding: '6px 9px'
        }
      })
      var elementModalStats = React.createElement(ModalMatchStats, {matchId: this.props.bet.id})
      var elements = [
        React.createElement(Bloc, {key: bet.id + 'time', width: 'initial', textAlign: 'center', lineHeight: '35px'}, time),
        React.createElement(Bloc, {key: bet.id + 'matchUpName', width: '284px', textAlign: 'center', lineHeight: '35px'}, matchUpName),
        React.createElement(Bloc, {key: bet.id + 'elementsCoteResult', width: 'initial', textAlign: 'center'}, elementsCoteResult),
        React.createElement(Bloc, {key: bet.id + 'elementsButtonStats', width: 'initial', textAlign: 'center'}, elementModalStats)
      ]
    }
    return d.div({
      style:{
        backgroundColor: COLOR.gray1,
        fontSize: '16px',
        textAlign: 'left',
        height: '35px',
        margin: '5px 0 0 0'
      }
    }, elements)
  },
  onCoteResultChange: function(cote, choose, names) {
    var sameCote = this.state.selectedCoteResult && this.state.selectedCoteResult.result == choose
    var next = sameCote ? -1 : choose
    var updateState = function() {
      this.setState({selectedCoteResult: {
          cote: cote,
          result: next,
          names: names
        },
        allCote: false
      })
    }
    this.refs.coteScoreSimple.setSelectedIndex(-1, true)
    if (this.refs.coteScoreFull) {
      this.refs.coteScoreFull.setSelectedIndex(-1, true)
    }
    updateState = updateState.bind(this)
    if (sameCote) {
      setTimeout(updateState, 0)
    }
    else {
      updateState()
    }
  },
  isClickAllCote: function() {
    this.setState({allCote: this.state.allCote ? false : true})
  },
  renderLineCoteScore: function(cote) {
    var cotes = []
    var names = []
    var realCote = []
    var matchNul = false
    if (cote) {
      for (var i = 0; i < this.props.bet.coteScore.length; i++) {
        if (cote.result == 0
        && this.props.bet.coteScore[i].scoreDomicile - this.props.bet.coteScore[i].scoreExterieur > 0
        && this.props.bet.coteScore[i].scoreDomicile < 4) {
          var score = this.props.bet.coteScore[i].scoreDomicile + '-' + this.props.bet.coteScore[i].scoreExterieur
          var coteScore = DecimalNumber.format(this.props.bet.coteScore[i].cote)
          cotes.push(this.renderCoteScore(score, coteScore))
          names.push(score)
          realCote.push(coteScore)
        }
        else if (cote.result == 1
        && this.props.bet.coteScore[i].scoreDomicile - this.props.bet.coteScore[i].scoreExterieur == 0) {
          var score = this.props.bet.coteScore[i].scoreDomicile + '-' + this.props.bet.coteScore[i].scoreExterieur
          var coteScore = DecimalNumber.format(this.props.bet.coteScore[i].cote)
          cotes.push(this.renderCoteScore(score, coteScore))
          names.push(score)
          realCote.push(coteScore)
          matchNul = true
        }
        else if (cote
        && cote.result == 2
        && this.props.bet.coteScore[i].scoreDomicile - this.props.bet.coteScore[i].scoreExterieur < 0
        && this.props.bet.coteScore[i].scoreExterieur < 4) {
          var score = this.props.bet.coteScore[i].scoreDomicile + '-' + this.props.bet.coteScore[i].scoreExterieur
          var coteScore = DecimalNumber.format(this.props.bet.coteScore[i].cote)
          cotes.push(this.renderCoteScore(score, coteScore))
          names.push(score)
          realCote.push(coteScore)
        }
      }
    }
    var elementsCoteScore = React.createElement(CoteGroupResult, {
      cotes: cotes,
      onChange: this.onCoteScoreChange.bind(this, 'coteScoreFull'),
      choose: names,
      realCote: realCote,
      ref: 'coteScoreSimple',
      buttonStyle: {
        width: '80px',
        boxSizing: 'border-box'
      }
    })
    if (matchNul) {
      var onButtonClick = null
      var isDisabled = true
    }
    else {
      onButtonClick = this.isClickAllCote
      isDisabled = false
    }
    var elementsButtonAllCote = React.createElement(MyButton, {
      style: {
        fontSize: 25,
        marginTop: '3px',
        padding: '1px 0',
        width:'41px'
      },
      onClick: onButtonClick,
      disabled: isDisabled
    }, d.i({className: this.state.allCote ? "fa fa-caret-up" : "fa fa-caret-down"}))
    return d.div({
      style:{
        backgroundColor: COLOR.gray1,
        fontSize: '16px',
        textAlign: 'left',
        padding: '5px 0 0 0'
      }
    },
      React.createElement(Bloc, {width: '505px', textAlign: 'center'}, elementsCoteScore),
      React.createElement(Bloc, {width: 'initial', textAlign: 'center'}, elementsButtonAllCote)
    )
  },
  renderCoteScore: function(score, cote) {
    return d.span({},
      d.div({
        style: {display: 'inline-block', marginRight: '15px'}
      }, score),
      d.div({
        style: {display: 'inline-block'}
      }, cote))
  },
  onCoteScoreChange: function(otherRef, object, choose, names, cote) {
    var coteScore = this.state.selectedCoteScore
    var next = coteScore && coteScore.result == choose && coteScore.otherRef == otherRef ? -1 : choose
    this.setState({selectedCoteScore: {
      otherRef: otherRef,
      cote: cote,
      result: next,
      names: names
    }})
    if (this.refs[otherRef]) {
      this.refs[otherRef].setSelectedIndex(-1, false)
    }
  },
  renderLineCoteAllScore: function(cote) {
    var elements = null
    var cotes = []
    var names = []
    var realCote = []
    if (cote) {
      for (var i = 0; i < this.props.bet.coteScore.length; i++) {
        if (cote.result == 0
        && this.props.bet.coteScore[i].scoreDomicile - this.props.bet.coteScore[i].scoreExterieur > 0
        && this.props.bet.coteScore[i].scoreDomicile >= 4
        && this.props.bet.coteScore[i].scoreDomicile < 10
        && this.props.bet.coteScore[i].scoreExterieur < 10) {
          var score = this.props.bet.coteScore[i].scoreDomicile + '-' + this.props.bet.coteScore[i].scoreExterieur
          var coteScore = DecimalNumber.format(this.props.bet.coteScore[i].cote)
          cotes.push(this.renderCoteScore(score, coteScore))
          names.push(score)
          realCote.push(coteScore)
        }
        else if (cote
        && cote.result == 2
        && this.props.bet.coteScore[i].scoreDomicile - this.props.bet.coteScore[i].scoreExterieur < 0
        && this.props.bet.coteScore[i].scoreExterieur >= 4
        && this.props.bet.coteScore[i].scoreDomicile < 10
        && this.props.bet.coteScore[i].scoreExterieur < 10) {
          var score = this.props.bet.coteScore[i].scoreDomicile + '-' + this.props.bet.coteScore[i].scoreExterieur
          var coteScore = DecimalNumber.format(this.props.bet.coteScore[i].cote)
          cotes.push(this.renderCoteScore(score, coteScore))
          names.push(score)
          realCote.push(coteScore)
        }
      }
    }
    var elementsCoteScore = React.createElement(CoteGroupResult, {
      width: 'initial',
      padding: '1px 0 4px 0',
      cotes: cotes,
      onChange: this.onCoteScoreChange.bind(this, 'coteScoreSimple'),
      choose: names,
      realCote: realCote,
      marginWidth: '12px',
      ref: 'coteScoreFull',
      buttonStyle: {
        width: '80px',
        boxSizing: 'border-box'
      }
    })
    return d.div({
      style:{
        backgroundColor: COLOR.gray1,
        fontSize: '16px',
        textAlign: 'left',
        padding: '5px 0 0 0'
      }
    }, React.createElement(Bloc, {
        width: '563px', textAlign: 'center', height: 'initial'
      }, elementsCoteScore)
    )
  },
  renderButtonSend: function() {
    var color = COLOR.black
    var backgroundColor = COLOR.white
    var borderColor = COLOR.gray3
    var hoverColor = COLOR.white
    var hoverBackgroundColor = COLOR.accent
    if (this.state.selectedCoteScore && this.state.selectedCoteScore.result > -1 && this.state.selectedCoteResult.result > -1) {
      var onClick = this.onValidateSelected
      var disabled = false
    }
    else {
      var color = COLOR.white
      var onClick = null
      var disabled = true
    }
    return React.createElement(MyButton, {
      color: color,
      hoverColor: hoverColor,
      backgroundColor: backgroundColor,
      hoverBackgroundColor: hoverBackgroundColor,
      borderColor: borderColor,
      onClick: onClick,
      disabled: this.state.isLoading || disabled,
      style: {
        padding: '4px 21px',
      }
    }, this.state.isLoading ? d.i({className: "fa fa-spinner fa-pulse"}) : 'Valider')
  },
  renderLineButtonValidate: function() {
    return d.div({
      style:{
        backgroundColor: COLOR.white,
        fontSize: '16px',
        textAlign: 'center',
        margin: '5px 5px 0 0',
        padding: '5px 0',
        height: '25px'
      }
    }, this.renderButtonSend())
  },
  handlePostBet: function(data) {
    this.setState({selectedCoteResult: {}, selectedCoteScore: {}, validate: true}, function() {
      this.refs['coteScoreSimple'].setSelectedIndex(-1, false)
    })
    if (this.props.onRefreshRequired) {
      this.props.onRefreshRequired(data)
    }
    if (this.props.onBet) {
      this.props.onBet()
    }
  },
  onValidateSelected: function() {
    var matchId = this.props.bet.id
    var scoreSplit = this.state.selectedCoteScore.names.split('-')
    var scoreDomicile = scoreSplit[0]
    var scoreExterieur = scoreSplit[1]
    var options = {
      url: './api/bet.php',
      method: 'POST',
      data: {'matchId': matchId, 'scoreDomicile': scoreDomicile, 'scoreExterieur': scoreExterieur}
    }
    this.setState({isLoading: true})
    Ajax.request(options, this.handlePostBet)
  },
  render: function() {
    var height = '40px'
    var coteResult = this.state.selectedCoteResult
    if (coteResult && coteResult.result > -1) {
      height = this.state.allCote ? '223px' : '122px'
    }
    if (this.state.validate) {
      height = '40px'
    }
    return d.div({
      style:{
        backgroundColor: COLOR.gray1,
        height: height,
        fontSize: '16px',
        overflowY: 'hidden',
        transition: 'all 0.7s'
      }
    },
    this.renderLineMatch(),
    this.renderLineCoteScore(coteResult),
    this.state.allCote ? this.renderLineCoteAllScore(coteResult) : null,
    this.renderLineButtonValidate())
  }
})

//Composant cote groupe
var CoteGroupResult = React.createClass({
  displayName: 'CoteGroupResult',
  getInitialState: function() {
    return {selectedCote: -1}
  },
  setSelectedIndex: function(index, update) {
    if (index != this.state.selectedCote) {
      this.setState({selectedCote: index})
      if (this.props.onChange && update) {
        this.props.onChange(this.props.cotes[index], index)
      }
    }
  },
  renderCote: function(cote, index, selected) {
    if (selected == index) {
      var color = COLOR.white
      var backgroundColor = COLOR.accent
      var borderColor = backgroundColor
    }
    else {
      var color = COLOR.black
      var backgroundColor = COLOR.white
      var borderColor = COLOR.gray3
    }
    var buttonStyle = {
      fontSize: '14px',
      marginTop: '3px'
    }
    var styles = $.extend(true, this.props.buttonStyle, buttonStyle)
    return React.createElement(MyButton, {
      key: cote + index,
      color: color,
      hoverColor: COLOR.white,
      backgroundColor: backgroundColor,
      hoverBackgroundColor: COLOR.accent,
      borderColor: borderColor,
      style: styles,
      onClick: this.onCoteClick.bind(this, index)
    }, cote)
  },
  onCoteClick: function(index) {
    var next = this.state.selectedCote == index ? -1 : index
    this.setState({selectedCote: next})
    if (this.props.onChange) {
      this.props.onChange(this.props.cotes[index], index, this.props.choose[index], this.props.realCote[index])
    }
  },
  render: function() {
    var elements = []
    for (var i = 0; i < this.props.cotes.length; i ++) {
      elements.push(this.renderCote(this.props.cotes[i], i, this.state.selectedCote))
      if (i < this.props.cotes.length - 1 && i != 5 && i != 11 && i != 17){
        elements.push(d.div({
          key: this.props.cotes.join(',') + i + '-margin',
          style: {
            display: 'inline-block',
            width: this.props.marginWidth ? this.props.marginWidth : '5px'
          }
        }))
      }
    }
    return d.div({
      style: {
        backgroundColor: 'white',
        padding: this.props.padding ? this.props.padding : '1px 0 0 0',
        fontSize: '15px',
        width: this.props.width ? this.props.width : 'initial'
      }
    }, elements)
  }
})

module.exports = BetTable
