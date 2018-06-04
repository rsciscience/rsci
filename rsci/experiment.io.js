"use strict";
const debug = require('debug')('RSCI.experiment.io');
var helpers = require('./helpers');

try {

  const Gpio = require('onoff').Gpio;
  var pin_food = new Gpio(1, 'out');
  var pin_drug = new Gpio(2, 'out');

  this.dispenseFood = function () {
    debug('dispenseFood');
    try {
      pin_food.writeSync(1);
      setTimeout(1000, () => { pin_food.writeSync(1); })
    } catch (e) {
      console.log(e);
    }
  };
  this.dispenseDrug = function () {
    debug('dispenseDrug');
    try {
      pin_drug.writeSync(1);
      setTimeout(1000, () => { pin_drug.writeSync(1); })
    } catch (e) {
      console.log(e);
    }

  };


  module.exports = this;

} catch (e) {


    // test stub
  this.dispenseFood = function () {
    debug('dispenseFood');
    console.log('IO not configured. Using test stubs');
  };
  this.dispenseDrug = function () {
    debug('dispenseDrug');
    console.log('IO not configured. Using test stubs');
  };
  module.exports = this;

}



