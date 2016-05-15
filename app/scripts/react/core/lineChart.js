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
        width: 1100,
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
        categories: this.props.rounds
      },
      series: this.props.data,
      yAxis: {
        title: {
          text: 'Classement'
        },
        allowDecimals: false,
        reversed: true
      },
            legend: {
        enabled: true
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: true,
        border: 0,
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b>{point.y}</b>',
        shadow: false
      },
      plotOptions: {
        pie: {
          dataLabels: {
            style: {
              color: COLOR.white,
              textShadow: 'none'
            },
          },
          borderWidth: 2,
          showInLegend: true,
          allowPointSelect: false,
          size: '100%'
        },
        series: {
          states: {
            hover: {
              enabled: true
            }
          }
        }
      },
    })
  },
  render: function() {
    return d.div({ref: 'container'})
  }
})

module.exports = LineChart
