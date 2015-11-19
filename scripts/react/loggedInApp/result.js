'use strict'
var d = React.DOM
//Barre bleu victoire
var WinBox = React.createClass({
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
  render: function() {
    var element = null
    if (this.props.match.scoreDomicile > this.props.match.scoreExterieur) {
      element = React.createElement(WinBox, {pos: 'left'})
    }
    return d.div({
      style:{
        display: 'inline-block',
        width: '200px',
        textAlign: 'right',
        color: COLOR.black,
        fontSize: '16px',
        float: 'left',
        fontFamily: 'Helvetica'
      }
    }, element, TeamInfo.get(this.props.match.teamDomicile).trueName)
  } 
})
//Score
var Score = React.createClass({
  render: function() {
    var element = []
    var fontType = 'normal'
    if (DateFormat.getTime(this.props.match.date) == 'aN:aN' && this.props.match.scoreDomicile < 0) {
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
  render: function() {
    var element = null
    if (this.props.match.scoreExterieur > this.props.match.scoreDomicile) {
      element = React.createElement(WinBox, {pos: 'right'})
    }
    return d.div({
      style:{
        display: 'inline-block',
        width: '200px',
        textAlign: 'left',
        color: COLOR.black,
        fontSize: '16px',
        float: 'right',
        fontFamily: 'Helvetica'
      }
    }, element, TeamInfo.get(this.props.match.teamExterieur).trueName)
  } 
})
//ligne match
var Match = React.createClass({
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
  render: function() {
  var dateScreen = DateFormat.getDate(this.props.match.date) 
  if (dateScreen == 'undefined NaN undefined') {
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
  componentDidMount: function() {
    $(this.refs.container.getDOMNode()).chosen({
      disable_search: true,
      width: '120px'
    }).change(this.onChange)
  },
  componentWillReceiveProps: function(newProps) {
    var select = $(this.refs.container.getDOMNode())
    select.val(newProps.round)
    select.trigger('chosen:updated')
  },
  onChange: function(e, data) {
    this.props.onRoundChanged(parseFloat(data.selected))
  },
  render: function() {
    var options = []
    for (i = 1; i < 22; i++) {
      if (i == this.props.round){
        options[i] = d.option({value: i, selected: 'selected'}, "Journée " + i)
      }
      else {
        options[i] = d.option({value: i}, "Journée " + i)
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
      ref: 'container'
    }, options))
  }
})

var LoadingBox = React.createClass({
  render: function() {
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
    }), "Chargement journée " + this.props.round)
  }
})
//Resultat
var Result = React.createClass({
  getInitialState: function() {
    return {matchs: null, round: null}
  },
  changeRound: function (round) {
    this.setState({matchs: null, round: round})
    var options = {
      url: './api/match.php?round=' + round,
      method: 'GET',
    }
    $.ajax(options).done(this.handleMatches)
  },
  handleMatches: function(data) {
    this.setState({matchs: data.match})
  },
  componentWillMount: function() {
    this.changeRound(this.props.initialRound)
  },
  onArrowHoverChange: function(left, hover) {
    var arrow = left ? 'arrowLeft' : 'arrowRight'
    var newState = {}
    newState[arrow] = hover
    this.setState(newState)
  },
  renderArrow: function(left, onClick) { 
    var isHover = this.state[left ? 'arrowLeft' : 'arrowRight']
    var padding = left ? '5px 0 5px 20px' : '5px 20px 5px 0'
    return d.div({
      style:{
        fontSize: '30px',
        padding: padding,
        display: 'inline-block',
        verticalAlign: 'middle',
        color: isHover ? COLOR.blue2 : COLOR.blue,
        transition: 'color 0.7s',
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
    this.changeRound(this.state.round + 1)
  },
  previousRound: function() {
    this.changeRound(this.state.round - 1)
  },
  render: function() {
    var elements = [
      this.state.round == 1 ? 
        d.div({
          style:{
            display: 'inline-block',
            padding: '5px 0px 5px 34.2969px'}
          }) : this.renderArrow(true, this.previousRound),
      React.createElement(RoundInput, {
        onRoundChanged: this.changeRound,
        round: this.state.round
      }),
      this.state.round == 21 ? 
        d.div({
          style:{
            display: 'inline-block',
            padding: '5px 34.2969px 5px 0px'}
          }) : this.renderArrow(false, this.nextRound)
    ]
    if (this.state.matchs) {
      //Fonction tous les matchs
      var results = []
      var actualDate = 0
      for (var i = 0; i < this.state.matchs.length; i++) {
        if (actualDate == DateFormat.getDate(this.state.matchs[i].date)) {
          results.push (React.createElement(Match, {match: this.state.matchs[i]}))
        }
        else {  
          results.push (
            React.createElement(LineDate, {match: this.state.matchs[i]}),
            React.createElement(Match, {match: this.state.matchs[i]}))
          actualDate = DateFormat.getDate(this.state.matchs[i].date)
        }
      }
      elements.push(results)
    }
    else {
      elements.push(React.createElement(LoadingBox, {round: this.state.round}))
    }
    return d.div({
      style:{
        textAlign: 'center',
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        padding: '15px',
        width: '560px',
        borderRadius: '5px'
      }
    }, elements)
  }
})