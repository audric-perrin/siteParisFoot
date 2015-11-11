'use strict'
var d = React.DOM
var Main = React.createClass({
  render: function(){
    return d.div({style: {
      fontFamily: 'Helvetica',
      backgroundColor: COLOR.gray1,
      width: '100%'
    }}, 
    // React.createElement(Box_login),
    // React.createElement(Box_signup),
    // React.createElement(Result, {initialRound: 11}),
    // React.createElement(Box_bet_result),
    // React.createElement(MyButton, {type: 'cote', fontSize: 18}, 3.10),
    // React.createElement(MyButton, {type: 'cote', fontSize: 18}, d.div({}, [
    //   d.div({
    //     style: {display: 'inline-block', marginRight: '15px'}
    //   }, '1-1'),
    //   d.div({
    //     style: {display: 'inline-block'}
    //   }, '3.85')
    // ])),
    // React.createElement(MyButton, {type: 'button', fontSize: 18}, d.i({className: "fa fa-calendar-times-o"})),
    // React.createElement(MyButton, {type: 'cote', fontSize: 18}, 2.85),
    // React.createElement(MyButton, {type: 'button', fontSize: 90}, d.i({className: "fa fa-hourglass-end"})),
    // React.createElement(MyButton, {type: 'button', fontSize: 18}, d.div({style: {width: '100px'}},'Validation')),
    React.createElement(App))
  }
})
Initializer.initialize(function () {
  React.render(React.createElement(Main), document.body)
})