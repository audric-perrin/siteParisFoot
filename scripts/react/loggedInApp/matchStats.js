'use strict'
var d = React.DOM
//Composant match stats
var MatchStats = React.createClass({
  componentDidMount: function() {
    $(this.refs.container.getDOMNode()).highcharts({
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
              name: 'Victoire (5)',
              y: 60,
              color: COLOR.green
          }, {
              name: 'Nul (3)',
              y: 30,
              color: COLOR.gray2
          }, {
              name: 'Défaite (1)',
              y: 10,
              color: COLOR.accent
          }]
      }],
    })
  },
  render: function() {
    return d.div({
      style: {
        // height: '100px',
        // width: '100px',
      },
      ref: 'container'
    })
  }
})