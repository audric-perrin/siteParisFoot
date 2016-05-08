'use strict'

var COLOR = require('../../utils/style')
var d = React.DOM

//Composant line chart
var LineChart = React.createClass({
  displayName: 'PieChart',
  componentDidMount: function() {
    $(this.refs.container).highcharts({
      chart: {
        type: 'line',
        width: 800,
        height: 300,
        style: {
          fontFamily: 'Helvetica'
        }
      },
      title: {
        text: 'Evolution du classement par journée'
      },
      subtitle: {
        text: 'Demi-saison 2015-2016'
      },
      xAxis: {
        categories: this.props.dataRound
      },
      yAxis: {
        title: {
          text: 'Classement'
        },
        allowDecimals: false,
        reversed: true
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: false
        }
      },
      series: [
        {
          color: COLOR.blue,
          data: this.props.dataRank
        },
      ]
    })
  },
  render: function() {
    return d.div({ref: 'container'})
  }
})

module.exports = LineChart
