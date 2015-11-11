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
    this.setState({isLoading: false, matchs: data.matchs})
  },
  componentWillMount: function() {
    this.dataBet()
  },
  render: function () {
    if (this.state.isLoading) {
      return d.div({}, 'loading')
    }
    else {
      var elements = []
      for (var i = 0; i < this.state.matchs.length; i++) {
        var renderDate = true
        if (i > 0 && DateFormat.getDate(this.state.matchs[i].match.date) == DateFormat.getDate(this.state.matchs[i - 1].match.date)) {
          renderDate = false
        }
          renderDate ? elements.push(React.createElement(RenderDate, {bet: this.state.matchs[i]})) : null
          elements.push(React.createElement(RenderBlocMatch, {bet: this.state.matchs[i]}))
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
    var dateValue = DateFormat.getDate(this.props.bet.match.date) 
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
    return {selectedCoteResult: {}, selectedCoteScore: {}, validate: false}
  },
  renderLineMatch: function() {
    var time = DateFormat.getTime(this.props.bet.match.date)
    var matchUpName = TeamInfo.get(this.props.bet.match.teamDomicile).trueName + ' - ' + TeamInfo.get(this.props.bet.match.teamExterieur).trueName
    var cotes = [
      this.props.bet.coteResult.coteDomicile,
      this.props.bet.coteResult.coteEgalite,
      this.props.bet.coteResult.coteExterieur
    ]
    var names = [
      TeamInfo.get(this.props.bet.match.teamDomicile).littleName,
      'Nul',
      TeamInfo.get(this.props.bet.match.teamExterieur).littleName,
    ]
    var elementsCoteResult = React.createElement(CoteGroupResult, {cotes: cotes, onChange: this.onCoteResultChange, choose: names, realCote: cotes})
    var elementsButtonStats = React.createElement(MyButton, {fontSize: 15, style: {marginTop: '2px'}}, d.i({className: "fa fa-bar-chart"}))
    var elementsMyBet = 
      this.state.selectedCoteResult.names
      + ' (' +
      this.state.selectedCoteResult.cote 
      + ') ' +
      this.state.selectedCoteScore.names
      + ' (' +
      this.state.selectedCoteScore.cote 
      + ')'
    if (this.state.validate) {
      var elements = [
        React.createElement(Bloc, {width: 'none', textAlign: 'center', lineHeight: '35px'}, time),
        React.createElement(Bloc, {width: '376px', textAlign: 'left', lineHeight: '35px'}, matchUpName),
        React.createElement(Bloc, {width: '181px', textAlign: 'center', lineHeight: '35px'}, elementsMyBet)
      ]
    }
    else {
      var elements = [
        React.createElement(Bloc, {width: 'none', textAlign: 'center', lineHeight: '35px'}, time),
        React.createElement(Bloc, {width: '376px', textAlign: 'left', lineHeight: '35px'}, matchUpName),
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
          var coteScore = this.props.bet.coteScore[i].cote
          cotes.push(this.renderCoteScore(score, coteScore))
          names.push(score)
          realCote.push(coteScore)
        }
        else if (cote.result == 1 
        && this.props.bet.coteScore[i].scoreDomicile - this.props.bet.coteScore[i].scoreExterieur == 0) {
          var score = this.props.bet.coteScore[i].scoreDomicile + '-' + this.props.bet.coteScore[i].scoreExterieur
          var coteScore = this.props.bet.coteScore[i].cote
          cotes.push(this.renderCoteScore(score, coteScore))
          names.push(score)
          realCote.push(coteScore)
        }
        else if (cote 
        && cote.result == 2 
        && this.props.bet.coteScore[i].scoreDomicile - this.props.bet.coteScore[i].scoreExterieur < 0
        && this.props.bet.coteScore[i].scoreExterieur < 4) {
          var score = this.props.bet.coteScore[i].scoreDomicile + '-' + this.props.bet.coteScore[i].scoreExterieur
          var coteScore = this.props.bet.coteScore[i].cote
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
      ref: 'coteScore'
    })
    var elementsButtonAllCote = React.createElement(MyButton, {style: {fontSize: 15, marginTop: '3px'}}, 'Plus de cotes')
    elements = [
      React.createElement(Bloc, {width: 'none', textAlign: 'center'}, elementsCoteScore),
      React.createElement(Bloc, {width: '127px', textAlign: 'center'}, elementsButtonAllCote)
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
    if (this.state.selectedCoteScore && this.state.selectedCoteScore.result > -1 && this.state.selectedCoteResult.result > -1) {
      var color = COLOR.black
      var backgroundColor = COLOR.white
      var borderColor = COLOR.gray3
      var hoverColor = COLOR.white
      var hoverBackgroundColor = COLOR.accent
      var onClick = this.onValidateSelected
    }
    else {
      var color = COLOR.gray1
      var backgroundColor = COLOR.white
      var borderColor = COLOR.gray2
      var hoverColor = COLOR.gray1
      var hoverBackgroundColor = COLOR.white
      var hoverBorderColor = COLOR.gray2
      var onClick = null
    }
    return React.createElement(MyButton, {
      color: color,
      hoverColor: hoverColor,
      backgroundColor: backgroundColor,
      hoverBackgroundColor: hoverBackgroundColor,
      borderColor: borderColor,
      hoverBorderColor: hoverBorderColor,
      onClick: onClick,
      style: {
        padding: '4px 21px',
      }
    }, 'Valider')
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
  onValidateSelected: function() {
    this.setState({validate: true})
  },
  render: function() {
    console.log(this.state)
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
    return React.createElement(MyButton, {
      color: color,
      hoverColor: COLOR.white,
      backgroundColor: backgroundColor,
      hoverBackgroundColor: COLOR.accent,
      borderColor: borderColor,
      style: {fontSize: '14px', marginTop: '3px'},
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