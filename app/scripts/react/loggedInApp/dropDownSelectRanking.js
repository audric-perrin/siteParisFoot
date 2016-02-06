'use strict'

var d = React.DOM

//Input user
var DropDownSelectRanking = React.createClass({
  displayName: 'DropDownSelectRanking',
  componentWillMount: function() {
    if (this.props.metaData) {
      var index = this.props.selectedIndex === null ? this.props.metaData[this.props.id].length - 1 : this.props.selectedIndex
      this.setState({id: this.props.id, select: index}, this.refreshSelect)
    }
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.metaData) {
      var index = newProps.selectedIndex === null ? newProps.metaData[newProps.id].length - 1 : newProps.selectedIndex
      this.setState({id: newProps.id, select: index}, this.refreshSelect)
    }
  },
  componentDidMount: function() {
    $(this.refs.container).chosen({
      disable_search: true,
      width: '250px',
      placeholder_text_single: 'Loading...'
    }).change(this.onChange)
  },
  refreshSelect: function() {
    var select = $(this.refs.container)
    select.trigger('chosen:updated')
  },
  onChange: function(e, data) {
    this.props.onChanged(parseFloat(data.selected))
  },
  render: function() {
    var options = []
    if (this.props.metaData) {
      for (var i = 0; i < this.props.metaData[this.state.id].length; i++) {
        options[i] = d.option({key: i, value: i}, this.props.metaData[this.state.id][i].label)
      }
    }
    return d.div({
      style: {
        paddingBottom: '5px',
        display: 'inline-block',
        margin: '15px 0',
        fontSize: '16px'
      }
    }, d.select({
      value: this.state.select,
      ref: 'container'
    }, options))
  }
})

module.exports = DropDownSelectRanking
