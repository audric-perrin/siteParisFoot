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
        width: 800,
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
        type: 'category',
        labels: {
            rotation: -45,
        }
      },
      yAxis: {
        min: 0,
        title: {
            text: 'Points'
        }
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
      series: [{
        color: COLOR.blue,
        data: this.props.data,
        dataLabels: {
          style: {
            color: COLOR.white,
            textShadow: 'none'
          },
          enabled: true,
          rotation: -90,
          align: 'right',
          format: '{point.y:.0f}', // one decimal
          y: 10, // 10 pixels down from the top
        }
      }]
    })
  },
  render: function() {
    return d.div({ref: 'container'})
  }
})

module.exports = ColumnChart