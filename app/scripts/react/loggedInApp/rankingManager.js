'use strict'

var Ajax = require('../../utils/ajax')
var COLOR = require('../../utils/style')
var SelectRanking = require('./selectRanking')
var Ranking = require('./ranking')
var d = React.DOM
var noDropDown = ['general', 'personnel']

//Manager de classement
var RankingManager = React.createClass({
  displayName: 'RankingManager',
  getInitialState: function() {
    return {rankSelected: 'saison', dropDownSelected: null, dropDown: false}
  },
  componentWillMount: function() {
    this.metaDataRanking()
    this.getRanking('saison')
  },
  getRanking: function(type, option) {
    this.setState({ranking: null})
    var options = {
      url: './api/ranking.php?type=' + type + (option ? '&option=' + option : ''),
      method: 'GET'
    }
    Ajax.request(options, this.handleRanking)
  },
  handleRanking: function(data) {
    this.setState({ranking: data.ranking})
  },
  metaDataRanking: function() {
    var options = {
      url: './api/rankingMetaData.php',
      method: 'GET'
    }
    Ajax.request(options, this.handleRankingMetaData)
  },
  handleRankingMetaData: function(data) {
    this.setState({rankingMetaData: data})
  },
  onDropDownSelectChanged: function(newSelect) {
    var rank = this.state.rankSelected
    var metaData = this.state.rankingMetaData
    var dropDown = noDropDown.indexOf(rank) == -1
    this.setState({dropDownSelected: newSelect})
    if (metaData || !dropDown) {
      this.getRanking(rank, dropDown ? metaData[rank][newSelect].value : null)
    }
  },
  onRankChanged: function(newRank, dropDown) {
    this.setState({rankSelected: newRank, dropDownSelected: null, dropDown: dropDown})
    this.getRanking(newRank)
  },
  noRanking: function() {
    return d.div({
      style: {
        fontSize: '16px',
        marginTop: '10px',
        padding: '15px 0',
        color: COLOR.black,
        backgroundColor: COLOR.white
      }
    }, 'Pas de classement')
  },
  isLoading: function() {
    return d.div({
      style: {
        fontSize: '16px',
        marginTop: '10px',
        padding: '15px 0',
        color: COLOR.black,
        backgroundColor: COLOR.white
      }
    }, d.i({
      style: {
        display: 'block',
        fontSize: '40px',
        marginBottom: '5px',
        color: COLOR.gray3
      },
      className: "fa fa-spinner fa-pulse"
    }), "Chargement des Classements")
  },
  render: function() {
    var content = null
    if (!this.state.ranking) {
      content = this.isLoading()
    } else if (this.state.ranking.length == 0) {
      content = this.noRanking()
    } else {
      content = React.createElement(Ranking, {ranking: this.state.ranking})
    }
    return d.div({
      style: {
        verticalAlign: 'top',
        display: 'inline-block',
        backgroundColor: COLOR.gray1,
        padding: '15px',
        width: '780px',
        borderRadius: '5px',
        boxSizing: 'border-box'
      }
    },
      React.createElement(SelectRanking, {
        onRankChanged: this.onRankChanged,
        rankSelected: this.state.rankSelected,
        dropDown: this.state.dropDown,
        metaData: this.state.rankingMetaData,
        dropDownSelected: this.state.dropDownSelected,
        onDropDownSelectChanged: this.onDropDownSelectChanged
      }),
      content
    )
  }
})

module.exports = RankingManager
