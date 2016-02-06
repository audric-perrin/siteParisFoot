'use strict'

var DateFormat = {
  capitalize: function(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  },
  isValid: function(date) {
    return date == '0000-00-00 00:00:00'
  },
  getDate: function(date) {
    return DateFormat.capitalize(moment.utc(date).local().format('dddd D MMMM'))
  },
  getMonth: function(date) {
    return DateFormat.capitalize(moment.utc(date).local().format('MMMM'))
  },
  getTime: function(date) {
    return moment.utc(date).local().format('HH:mm')
  }
}

module.exports = DateFormat
