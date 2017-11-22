"use strict";

var ee = require('event-emitter');

var base  = class base {
    constructor() {
        this.start = function() {
          
           let  doStuff = function ()  {
                this.emit('Start', {eventTimeStamp:new Date(), eventType:'Start' } ); 
                this.emit('ButtonPress', {eventTimeStamp:new Date(), eventType:'ButtonPress' }  ); 
                this.emit('Light' , {eventTimeStamp:new Date(), eventType:'Light' } ); 
                this.emit('Light', {eventTimeStamp:new Date(), eventType:'Light' }  ); 
                this.emit('ButtonPress', {eventTimeStamp:new Date(), eventType:'Light' }  ); 

            }.bind(this);

            doStuff();
            
            setTimeout(doStuff,3000);
            setTimeout(doStuff,5000);
            setTimeout(doStuff,7000);
            setTimeout(doStuff,9000);
            setTimeout(doStuff,13000);
            setTimeout(doStuff,33000);

        }

    };

};

ee(base.prototype); 


module.exports = base;

