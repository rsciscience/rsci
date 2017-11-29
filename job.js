"use strict";

var ee = require('event-emitter');

var base  = class base {
    constructor() {
        this.start = function() {
            this.emit('Start', {eventTimeStamp:new Date(), eventType:'Start' } );
            this.emit('ButtonPress', {eventTimeStamp:new Date(), eventType:'ButtonPress' }  ); 
            this.emit('Light' , {eventTimeStamp:new Date(), eventType:'Light' } ); 
            this.emit('Light', {eventTimeStamp:new Date(), eventType:'Light' }  ); 
            this.emit('ButtonPress', {eventTimeStamp:new Date(), eventType:'Light' }  ); 
            this.emit('theFerg', {eventTimeStamp:new Date(), eventType:'theFerg' }  ); 
        }
    };

};

ee(base.prototype); 


module.exports = base;

