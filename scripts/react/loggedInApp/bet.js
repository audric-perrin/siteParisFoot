'use strict'
var d = React.DOM
//Composant table paris
var BetTable = React.createClass({
  getInitialState: function() {
    return {isLoading: true, matchs: null}
  },
  dataBet: function () {
    var options = {
      url: './api/bet.php',
      method: 'GET',
    }
    this.setState({isLoading: true})
    $.ajax(options).done(this.handleMatches)
  },
  handleMatches: function(data) {
    var matchs = []
    for (var matchId in data) {
      var match = data[matchId]
      match.id = matchId
      matchs.push(match)
    }
    matchs.sort(function(m1, m2) {
      var date1 = new Date(m1.date)
      var date2 = new Date(m2.date)
      return date1.getTime() - date2.getTime()
    })
    this.setState({isLoading: false, matchs: matchs})
  },
  componentWillMount: function() {
    this.dataBet()
  },
  render: function () {
    if (this.state.isLoading) {
        return d.div({
        style:{
          fontSize: '16px',
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
      }), "Chargement des Paris")
    }
    else {
      var elements = []
      for (var i = 0; i < this.state.matchs.length; i++) {
        var renderDate = true
        if (i > 0 && DateFormat.getDate(this.state.matchs[i].date) == DateFormat.getDate(this.state.matchs[i - 1].date)) {
          renderDate = false
        }
          renderDate ? elements.push(React.createElement(RenderDate, {bet: this.state.matchs[i]})) : null
          elements.push(React.createElement(RenderBlocMatch, {bet: this.state.matchs[i], onRefreshRequired: this.handleMatches}))
      }
      return d.div({
        style: {
          display: 'inline-block',
          backgroundColor: COLOR.gray1,
          borderRadius: '5px',
          textAlign: 'center',
          padding: '5px 10px 15px 15px'
        }
      }, elements)
    }
  }
})
// Composant ligne date
var RenderDate = React.createClass({
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
  getInitialState: function() {
    return {selectedCoteResult: {}, selectedCoteScore: {}, validate: false, isLoading: false}
  },
  renderLineMatch: function() {
    var time = DateFormat.getTime(this.props.bet.date)
    var matchUpName = [
      TeamInfo.get(this.props.bet.teamDomicile).countryName,
      React.createElement(Logo, {name: this.props.bet.teamDomicile, float: 'left', margin: '8px 10px'}),
      ' - ',
      React.createElement(Logo, {name: this.props.bet.teamExterieur, float: 'right', margin: '8px 10px'}),
      TeamInfo.get(this.props.bet.teamExterieur).countryName
    ]
    if (this.props.bet.bet) {
      var scoreDomicile = parseFloat(this.props.bet.bet.scoreDomicile)
      var scoreExterieur = parseFloat(this.props.bet.bet.scoreExterieur)
      var coteResult = parseFloat(this.props.bet.bet.coteResult)
      var coteScore = parseFloat(this.props.bet.bet.coteScore)
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
          nameResult: this.props.bet.teamDomicile,
          coteResult: coteResult,
          nameScore: nameScore,
          coteScore: coteScore
        })
      }
      else {
        var elementsMyBet = React.createElement(MyBet, {      
          nameResult: this.props.bet.teamExterieur,
          coteResult: coteResult,
          nameScore: nameScore,
          coteScore: coteScore
        })
      }
      var elements = [
        React.createElement(Bloc, {width: 'none', textAlign: 'center', lineHeight: '35px'}, time),
        React.createElement(Bloc, {width: '345px', textAlign: 'center', lineHeight: '35px'}, matchUpName),
        React.createElement(Bloc, {width: '210px', textAlign: 'center', lineHeight: '35px'}, elementsMyBet)
      ]
    }
    else {
      var names = [
        this.props.bet.teamDomicile,
        'Nul',
        this.props.bet.teamExterieur,
      ]
      var cotes = [
        CoteNumber.format(this.props.bet.coteResult.domicile),
        CoteNumber.format(this.props.bet.coteResult.egalite),
        CoteNumber.format(this.props.bet.coteResult.exterieur)
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
      var elementsButtonStats = React.createElement(MyButton, {
        fontSize: 15,
        style: {
          marginTop: '4px',
          padding: '4px 11px'
        }
      }, d.i({className: "fa fa-bar-chart"}))
      var elements = [
        React.createElement(Bloc, {width: 'none', textAlign: 'center', lineHeight: '35px'}, time),
        React.createElement(Bloc, {width: '345px', textAlign: 'center', lineHeight: '35px'}, matchUpName),
        React.createElement(Bloc, {width: 'none', textAlign: 'center'}, elementsCoteResult),
        React.createElement(Bloc, {width: 'none', textAlign: 'center'}, elementsButtonStats)
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
    var sameCote = this.state.selectedCoteResult.result == choose
    var next = sameCote ? -1 : choose
    var updateState = function() {
      this.setState({selectedCoteResult: {
        cote: cote,
        result: next,
        names: names
      }})
    }
    updateState = updateState.bind(this)
    if (sameCote) {
      setTimeout(updateState, 0)
    }
    else {
      updateState()
    }
    this.refs.coteScore.setSelectedIndex(-1)
  },
  renderLineCoteScore: function(cote) {
    var elements = null
    var cotes = []
    var names = []
    var realCote = []
    if (cote) {   
      for (var i = 0; i < this.props.bet.coteScore.length; i++) {
        if (cote.result == 0 
        && this.props.bet.coteScore[i].scoreDomicile - this.props.bet.coteScore[i].scoreExterieur > 0
        && this.props.bet.coteScore[i].scoreDomicile < 4) {
          var score = this.props.bet.coteScore[i].scoreDomicile + '-' + this.props.bet.coteScore[i].scoreExterieur
          var coteScore = CoteNumber.format(this.props.bet.coteScore[i].cote)
          cotes.push(this.renderCoteScore(score, coteScore))
          names.push(score)
          realCote.push(coteScore)
        }
        else if (cote.result == 1 
        && this.props.bet.coteScore[i].scoreDomicile - this.props.bet.coteScore[i].scoreExterieur == 0) {
          var score = this.props.bet.coteScore[i].scoreDomicile + '-' + this.props.bet.coteScore[i].scoreExterieur
          var coteScore = CoteNumber.format(this.props.bet.coteScore[i].cote)
          cotes.push(this.renderCoteScore(score, coteScore))
          names.push(score)
          realCote.push(coteScore)
        }
        else if (cote 
        && cote.result == 2 
        && this.props.bet.coteScore[i].scoreDomicile - this.props.bet.coteScore[i].scoreExterieur < 0
        && this.props.bet.coteScore[i].scoreExterieur < 4) {
          var score = this.props.bet.coteScore[i].scoreDomicile + '-' + this.props.bet.coteScore[i].scoreExterieur
          var coteScore = CoteNumber.format(this.props.bet.coteScore[i].cote)
          cotes.push(this.renderCoteScore(score, coteScore))
          names.push(score)
          realCote.push(coteScore)
        }
      }
    }
    var elementsCoteScore = React.createElement(CoteGroupResult, {
      cotes: cotes, 
      onChange: this.onCoteScoreChange, 
      choose: names,
      realCote: realCote,
      ref: 'coteScore',
      buttonStyle: {
        width: '80px',
        boxSizing: 'border-box'
      }
    })
    var elementsButtonAllCote = React.createElement(MyButton, {style: {fontSize: 15, marginTop: '3px'}}, 'Plus de cotes')
    elements = [
      React.createElement(Bloc, {width: 'none', textAlign: 'center'}, elementsCoteScore),
      React.createElement(Bloc, {width: 'none', textAlign: 'center'}, elementsButtonAllCote)
    ]
    return d.div({
      style:{
        backgroundColor: COLOR.gray1,
        fontSize: '16px',
        textAlign: 'left',
        padding: '5px 0'
      }
    }, elements)
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
  onCoteScoreChange: function(object, choose, names, cote) {
    var next = this.state.selectedCoteScore.result == choose ? -1 : choose
    this.setState({selectedCoteScore: {
      cote: cote,
      result: next,
      names: names
    }})
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
    var elements = this.renderButtonSend()
    return d.div({
      style:{
        backgroundColor: COLOR.white,
        fontSize: '16px',
        textAlign: 'center',
        marginRight: '5px',
        padding: '5px 0',
        height: '25px'
      }
    }, elements)
  },
  handlePostBet: function(data) {
    this.setState({validate: true})
    if (this.props.onRefreshRequired) {
      this.props.onRefreshRequired(data)
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
    $.ajax(options).done(this.handlePostBet)
  },
  render: function() {
    var height = this.state.selectedCoteResult.result > -1 ? '122px' : '40px'
    height = this.state.validate ? '40px' : height
    return d.div({
      style:{
        backgroundColor: COLOR.gray1,
        height: height,
        fontSize: '16px',
        overflowY: 'hidden',
        transition: 'all 0.7s'
      }
    }, this.renderLineMatch(), this.renderLineCoteScore(this.state.selectedCoteResult), this.renderLineButtonValidate())
  }
})
//Composant bloc
var Bloc = React.createClass({
  render: function() {
    return d.div({
      style: {      
        display: 'inline-block',
        backgroundColor: COLOR.white,
        width: this.props.width,
        textAlign: this.props.textAlign,
        lineHeight: this.props.lineHeight,
        padding: '0 5px',
        verticalAlign: 'middle',
        height: '35px',
        margin: '0 5px 0 0'
      }
    }, this.props.children)
  }
})
//Composant cote groupe
var CoteGroupResult = React.createClass({
  getInitialState: function() {
    return {selectedCote: -1}
  },
  setSelectedIndex: function(index) {
    this.setState({selectedCote: index})
    if (this.props.onChange) {
      this.props.onChange(this.props.cotes[index], index)
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
    console.log(this.props)
  },
  render: function() {
    var elements = []
    for (var i = 0; i < this.props.cotes.length; i ++) {
      elements.push(this.renderCote(this.props.cotes[i], i, this.state.selectedCote))
      if (i < this.props.cotes.length - 1){
        elements.push(d.div({
          style: {
            display: 'inline-block',
            width: '5px'
          }
        }))
      }
    }
    return d.div({
      style: {
        backgroundColor: 'white',
        paddingTop: '1px',
        fontSize: '15px'
      }
    }, elements)
  }
})