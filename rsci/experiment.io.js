"use strict";
const debug = require('debug')('RSCI.experiment.io');
const Gpio = require('onoff').Gpio;
var helpers = require('./helpers');

var pin_food = new Gpio(1, 'out');
var pin_drug= new Gpio(2, 'out');

this.despenseFood = async function () {
  debug('despenseFood');
  pin_food.writeSync(1);
  setTimeout(1000, ()=>{  pin_food.writeSync(1); })
};
this.despenseDrug = async function () {
  debug('despenseDrug');
  pin_drug.writeSync(1);
  setTimeout(1000, ()=>{  pin_drug.writeSync(1); })
};

module.exports = this;
