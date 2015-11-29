'use strict'
var DecimalNumber = {  
  format: function(number) {
    var number = parseFloat(number)
    if (number >= 100) {
      return number.toFixed(0)
    }    
    else if (number >= 10) {
      return number.toFixed(1)
    }    
    else {
      return number.toFixed(2)
    }
  }
}