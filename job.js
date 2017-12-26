"use strict";

var ee = require('event-emitter');
const debug = require('debug')('RSCI.job');

var base  = class base {
    constructor(jobId) {
        this.id = jobId;
        this.start = startmeup ;
        this.doEvent = doEvent;
        
        function doEvent (eventType){
            debug('doEvent:' + eventType);
            this.emit('Action', {eventTimeStamp:new Date(), eventType: eventType } );
            this.uiCalls.emitAction({ type: eventType });
        };

        function startmeup (clientCommunicationFunctions) {
            debug('startmeup');
          this.uiCalls = clientCommunicationFunctions;
          this.state = {};
            this.emit('Start', {eventTimeStamp:new Date(), eventType:'Start' } );
            this.uiCalls.start({ id: this.id });
            
            this.state.currentScene = 1;
            this.doEvent('changeToScene1');
            
            setTimeout(() => {
                this.emit('Stop', {eventTimeStamp:new Date(), eventType:'Stop' } );
                this.uiCalls.stop({ id: this.id });
            }, 30000);

        };

      this.listen = function(incomingMessage) {
            debug('listen');
            this.emit('Action', {eventTimeStamp:new Date(), eventType: incomingMessage.type }  ); 
            this.state[incomingMessage.type]++;

            debug(incomingMessage.type);
        
            if (incomingMessage.type === 'Scene1TrialStartNosepoke_onclick') {
                setTimeout(() => {
                    this.state.limitedholdStartAt = new Date();
                    this.state.currentScene = 2;
                    this.doEvent('changeToScene2');
                    this.state.winningPokeHole =  Math.floor(Math.random() * 5) + 1 ;
                    debug('Next winner is poke ' + this.state.winningPokeHole );
                    this.doEvent('nosepokeStimulus_' + this.state.winningPokeHole);
                }, 5000); 
            }

            if (incomingMessage.type === 'Scene2nosepokestim1_onclick') {               
                if(this.state.winningPokeHole  ===  1){
                    debug('Winner !!!!'); 
                    this.state.currentScene = 3;
                    this.doEvent('changeToScene3');
                }else{
                    this.state.currentScene = 4;
                    this.doEvent('changeToScene4');
                }
            }
            if (incomingMessage.type === 'Scene2nosepokestim2_onclick') {
                if(this.state.winningPokeHole  ===  2){
                    debug('Winner !!!!'); 
                    this.state.currentScene = 3;
                    this.doEvent('changeToScene3');
                }else{
                    this.state.currentScene = 4;
                    this.doEvent('changeToScene4');
                }
            }
            if (incomingMessage.type === 'Scene2nosepokestim3_onclick') {
                if(this.state.winningPokeHole  ===  3){
                    debug('Winner !!!!'); 
                    this.state.currentScene = 3;
                    this.doEvent('changeToScene3');
                }else{
                    this.state.currentScene = 4;
                    this.doEvent('changeToScene4');
                }
            }
            if (incomingMessage.type === 'Scene2nosepokestim4_onclick') {
                if(this.state.winningPokeHole  ===  4){
                    debug('Winner !!!!'); 
                    this.state.currentScene = 3;
                    this.doEvent('changeToScene3');
                }else{
                    this.state.currentScene = 4;
                    this.doEvent('changeToScene4');
                }
            }
            if (incomingMessage.type === 'Scene2nosepokestim5_onclick') {
                if(this.state.winningPokeHole  ===  5){
                    debug('Winner !!!!'); 
                    this.state.currentScene = 3;
                    this.doEvent('changeToScene3');
                }else{
                    this.state.currentScene = 4;
                    this.doEvent('changeToScene4');
                }
            }

        }.bind(this);
    };

};

ee(base.prototype); 


module.exports = base;

