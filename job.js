"use strict";

var ee = require('event-emitter');
 
var  base = function () {  };
ee(base.prototype); 
 
var me = new base(), listener;
 

me.start = () => {

    me.emit('Start' ); 
    me.emit('ButtonPress' ); 
    me.emit('Light' ); 
    me.emit('ButtonPress' ); 
    me.emit('ButtonPress' ); 

}


module.exports = me;

var ee = require('event-emitter');

var MyClass = function () { /* .. */ };
ee(MyClass.prototype); // All instances of MyClass will expose event-emitter interface 

var emitter = new MyClass(), listener;

emitter.on('test', listener = function (args) {
 // … react to 'test' event 
});
