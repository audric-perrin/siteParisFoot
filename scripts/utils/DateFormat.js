'use strict'
//tableau monthName
var monthName = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre'
]
//tableau weekDay
var weekDay = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi'
]
var DateFormat = {
  getDate: function(date) {
    date = new Date(date)
    date = new Date(date.getTime() + 60 * 60 * 1000)
    var day = weekDay[date.getDay()] // valeur 0 et 6
    var number = date.getDate() //  valeur entre 1 et 31
    var month = monthName[date.getMonth()] // valeur entre 0 et 11
    return day + ' ' + number + ' ' + month
  },
  getMonth: function(date) {
    date = new Date(date)
    date = new Date(date.getTime() + 60 * 60 * 1000)
    var month = monthName[date.getMonth()] // valeur entre 0 et 11
    return month
  },
  getTime: function(date) {
    date = new Date(date)
    date = new Date(date.getTime() + 60 * 60 * 1000)
    var hours = ('0' + date.getHours()).slice(-2) // valeur entre 0 et 23
    var minutes = ('0' + date.getMinutes()).slice(-2) // Valeur entre 0 et 59
    return hours + ':' + minutes
  }
}