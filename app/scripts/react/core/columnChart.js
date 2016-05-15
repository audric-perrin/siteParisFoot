'use strict'

var COLOR = require('../../utils/style')
var d = React.DOM

//Composant match stats
var ColumnChart = React.createClass({
  displayName: 'ColumnChart',
  componentDidMount: function() {
    $(this.refs.container).highcharts({
      chart: {
        type: 'column',
        width: 1100,
        height: 300,
        style: {
          fontFamily: 'Helvetica'
        }
      },
      title: {
        text: 'Nombre de points par journée'
      },
      subtitle: {
        text: 'Saison 2015-2016'
      },
      xAxis: {
        categories: this.props.rounds,
      },
      yAxis: {
        min: 0,
        title: {
            text: 'Points'
        }
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
      series: this.props.data,
    })
  },
  render: function() {
    return d.div({ref: 'container'})
  }
})

module.exports = ColumnChart