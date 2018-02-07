"use strict";
var ee = require('event-emitter');
const debug = require('debug')('RSCI.session');

var base  = class base {
    constructor(sessionId,experiment) {
        this.id = sessionId;
        this.start = startmeup ;
        this.config = experiment.sessionConfig;
        this.experiment = experiment
            
        function startmeup (clientCommunicationFunctions) {
            debug('startmeup');
            this.uiCalls = clientCommunicationFunctions;
            this.state = {};
            this.state.ignoreExtraneousInputs = false;
            this.emit('Start', {eventTimeStamp:new Date(), eventType:'Start' } );
            this.uiCalls.start({ id: this.id }); 

            ChangeSceneTo (1);
                
            setTimeout(() => {
                this.emit('Stop', {eventTimeStamp:new Date(), eventType:'Stop' } );
                this.uiCalls.stop({ id: this.id });
            }, this.config.duration);

        };

         var doEvent = function (eventType){
            debug('doEvent:' + eventType);
            this.emit('Action', {eventTimeStamp:new Date(), eventType: eventType } );
            this.uiCalls.emitAction({ type: eventType });
        }.bind(this);

        var prematureResponse  = function (){
            clearTimeout (this.state.interTrialIntervalTimeOut);
            ChangeSceneTo (5);
            setTimeout(() => {
                ChangeSceneTo (1);   
            }, 5000);  
        }.bind(this);

        var ChangeSceneTo  = function (newScene){ 
            this.state.currentScene = newScene;
            doEvent('changeToScene'+ newScene);
        }.bind(this);

        var CorrectResponseTime = function (){
            debug('Winner !!!!'); 
            ChangeSceneTo (3);

            setTimeout(() => {
                ChangeSceneTo (1);   
            }, 1000);
        }.bind(this);

        var IncorrectResponseTime = function (){
            ChangeSceneTo (4);

            setTimeout(() => {
                ChangeSceneTo (1);   
            }, 10000);
        }.bind(this);

        var callAWinner = function (poke){
            if(this.state.winningPokeHole  ===  poke){
                CorrectResponseTime() ;
            }else{
                IncorrectResponseTime();
            }
        }.bind(this);

      this.listen = function(incomingMessage) {
            debug('listen');
            this.emit('Action', {eventTimeStamp:new Date(), eventType: incomingMessage.type }  ); 
            this.state[incomingMessage.type]++;
            debug(incomingMessage.type);

            if (this.state.ignoreExtraneousInputs === true){
                return;
            }
    
            if (incomingMessage.type === 'Scene1TrialStartNosepoke_onclick') {
               this.state.interTrialIntervalTimeOut = setTimeout(() => {
                    this.state.interTrialInterval = new Date();
                    ChangeSceneTo (2);
                    this.state.winningPokeHole =  Math.floor(Math.random() * 5) + 1 ;
                    debug('Next winner is poke ' + this.state.winningPokeHole );
                    doEvent('nosepokeStimulus_' + this.state.winningPokeHole);
                }, 5000); 
                doEvent('ITIOn');
            }

            if (incomingMessage.type === 'Scene2nosepokestim1_onclick') {               
                callAWinner(1);
            }
            if (incomingMessage.type === 'Scene2nosepokestim2_onclick') {
                callAWinner(2);
            }
            if (incomingMessage.type === 'Scene2nosepokestim3_onclick') {
                callAWinner(3);
            }
            if (incomingMessage.type === 'Scene2nosepokestim4_onclick') {
                callAWinner(4);
            }
            if (incomingMessage.type === 'Scene2nosepokestim5_onclick') {
                callAWinner(5);
            }

            if (incomingMessage.type === "prematureResponse1"){
                prematureResponse ();
            }
            if (incomingMessage.type === "prematureResponse2"){
                prematureResponse ();
            }
            if (incomingMessage.type === "prematureResponse3"){
                prematureResponse ();
            }
            if (incomingMessage.type === "prematureResponse4"){
                prematureResponse ();
            }
            if (incomingMessage.type === "prematureResponse5"){
                prematureResponse ();
            }


        }.bind(this);
    };

};

ee(base.prototype); 


module.exports = base;

