'use strict'
var d = React.DOM
//Logo
var Logo = React.createClass({
  render: function() {
    var teamName = this.props.name
    return d.div({
      style: {
        display: 'inline-block',
        backgroundImage: 'url(./images/teamLogo/' + teamName + '.png)',
        height: '20px',
        width: '20px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        margin: this.props.margin,
        float: this.props.float,
        backgroundPosition: 'center center'
      }
    })
  }
})