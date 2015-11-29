'use strict'
var d = React.DOM
//Composant bloc
var Bloc = React.createClass({
  render: function() {
    return d.div({
      style: {      
        display: 'inline-block',
        backgroundColor: COLOR.white,
        width: this.props.width ? this.props.width : 'initial',
        textAlign: 'center',
        lineHeight: this.props.lineHeight,
        padding: '0 5px',
        verticalAlign: 'middle',
        height: this.props.height ? this.props.height : '35px',
        margin: '0 5px 0 0'
      }
    }, this.props.children)
  }
})