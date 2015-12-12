'use strict'
var d = React.DOM
//Manager de classement
var RankingManager = React.createClass({
  getInitialState: function() {
    return {rankSelected: 1, dropDownSelected: null, dropDown: false}
  },
  componentWillMount: function() {
    this.metaDataRanking()
    this.getRanking(1)
  },
  getRanking: function(type, options) {
    if (type == 1) {
      var options = {
        url: './api/ranking.php',
        method: 'GET'
      }
    }
    $.ajax(options).done(this.handleRanking)
  },
  handleRanking: function(data) {
    this.setState({ranking: data.ranking})
  },
  metaDataRanking: function() {
    var options = {
      url: './api/rankingMetaData.php',
      method: 'GET'
    }
    $.ajax(options).done(this.handleRankingMetaData)
  },
  handleRankingMetaData: function(data) {
    this.setState({rankingMetaData: data})
  },
  onDropDownSelectChanged: function(newSelect) {
    console.log(newSelect)
    this.setState({dropDownSelected: newSelect})
  },
  onRankChanged: function(newRank, dropDown) {
    this.setState({rankSelected: newRank, dropDownSelected: null, dropDown: dropDown})
  },
  isLoading: function() {
    return d.div({
      style:{
        fontSize: '16px',
        width: '780px',
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
    var elements = [
      React.createElement(SelectRanking, {
        onRankChanged: this.onRankChanged,
        rankSelected: this.state.rankSelected,
        dropDown: this.state.dropDown,
        metaData: this.state.rankingMetaData,
        dropDownSelected: this.state.dropDownSelected,
        onDropDownSelectChanged: this.onDropDownSelectChanged
      })
    ]
    if (!this.state.ranking) {
      elements.push(this.isLoading())
    }
    else {
      elements.push(React.createElement(Ranking, {ranking: this.state.ranking}))
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
    }, elements)
  }
})