"use strict";

var ee = require('event-emitter');

var base  = class base {
    constructor(jobId) {
        this.id = jobId;
        this.start = function(clientCommunicationFunctions) {
            this.uiCalls = clientCommunicationFunctions;
            this.emit('Start', {eventTimeStamp:new Date(), eventType:'Start' } );
            this.uiCalls.start({ id: this.id });

            setTimeout(() => {
                this.emit('Stop', {eventTimeStamp:new Date(), eventType:'Stop' } );
                this.uiCalls.stop({ id: this.id });
            }, 10000);
        };

        this.listen = (event) => {
            this.emit(event.type, {eventTimeStamp:new Date(), eventType: event.type }  ); 

            if (event.type === btnBlueOnClick) {
                this.emit('Action', {eventTimeStamp:new Date(), eventType:'Flash' } );

                this.uiCalls.emitAction({ type: 'Flash' });
            }
        };
    };

};

ee(base.prototype); 


module.exports = base;

