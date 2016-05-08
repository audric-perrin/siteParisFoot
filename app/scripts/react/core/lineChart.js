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
        text: 'Saison 2015-2016'
      },
      xAxis: {
        categories: ['14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36']
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
      series: [{
        color: COLOR.blue,
        data: [1,1,1,2,3,2,3,4,5,8,6,5,6,4,7,8,9,4,3,2,3,4,2]
      }]
    })
  },
  render: function() {
    return d.div({ref: 'container'})
  }
})

module.exports = LineChart
