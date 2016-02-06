'use strict'

var COLOR = require('../../utils/style')
var d = React.DOM

//Composant match stats
var PieChart = React.createClass({
  displayName: 'PieChart',
  componentDidMount: function() {
    $(this.refs.container).highcharts({
      chart: {
        type: 'pie',
        width: 150,
        height: 150
      },
      title: {
        text: null
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false
          },
          borderWidth: 2,
          showInLegend: true,
          allowPointSelect: false,
          size: '100%'
        },
        series: {
          states: {
            hover: {
              enabled: false
            }
          }
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
          name: 'Brands',
          colorByPoint: true,
          data: [{
              y: this.props.win,
              color: COLOR.green
          }, {
              y: this.props.nul,
              color: COLOR.gray2
          }, {
              y: this.props.loose,
              color: COLOR.accent
          }]
      }],
    })
  },
  render: function() {
    return d.div({ref: 'container'})
  }
})

module.exports = PieChart
