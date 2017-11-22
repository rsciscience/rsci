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
