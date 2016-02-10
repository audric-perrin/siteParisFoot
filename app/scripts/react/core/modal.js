'use strict'

var COLOR = require('../../utils/style')

var d = React.DOM
var CSSTransitionGroup = React.addons.CSSTransitionGroup

var Modal = React.createClass({
  displayName: 'Modal',
  getDefaultProps: function(){
    return {
      shown: false,
      width: 600
    }
  },

  attachBackdrop: function() {
    if (!$('.modal-backdrop').length) {
      $('body').append('<div class="modal-backdrop fade"></div>')
    }
  },
  updateBackdrop: function(shown) {
    $('body').css('overflow', shown ? 'hidden' : 'initial')
    if (!shown) {
      $('.modal-backdrop').removeClass('in')
    } else {
      $('.modal-backdrop').addClass('in')
    }
  },

  componentWillReceiveProps: function(newProps) {
    this.updateBackdrop(newProps.shown)
  },
  componentWillMount: function() {
    this.attachBackdrop()
    this.updateBackdrop(this.props.shown)
  },

  onModalClick: function(e) {
    if (this.props.onClose) {
      this.props.onClose()
    }
  },
  onModalCloseClick: function(e) {
    if (this.props.onClose) {
      this.props.onClose()
    }
  },
  onModalDialogClick: function(e) {
    e.stopPropagation()
  },

  renderDefaultModalClose: function() {
    return d.div({
      style: {
        color: COLOR.gray2,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: 1,
        marginTop: 1,
        fontSize: 15
      }
    }, d.i({className: 'fa fa-times'}))
  },
  render: function() {
    var renderModalClose = this.props.renderModalClose || this.renderDefaultModalClose
    var modalContent = [
      d.div({
        key: 'modalClose',
        className: 'modal-close',
        onClick: this.onModalCloseClick,
        style: {
          position: 'absolute',
          right: 0
        }
      }, renderModalClose()),
      d.div({
        key: 'modalContent'
      }, this.props.children)
    ]

    var elements = []
    if (this.props.shown) {
      var width = this.props.width
      elements.push(
        d.div({
          key: 'modal',
          className: 'modal',
          onClick: this.onModalClick
        },
          d.div({
            className: 'modal-dialog',
            onClick: this.onModalDialogClick,
            style: {
              width: width
            }
          },
            d.div({
              className: 'modal-content'
            }, modalContent)))
        )
    }

    return React.createElement(CSSTransitionGroup, {
      transitionName: 'modal',
      transitionEnterTimeout: 300,
      transitionLeaveTimeout: 300,
      transitionAppearTimeout: 300,
      transitionAppear: true
    }, elements)

  }
})

module.exports = Modal
