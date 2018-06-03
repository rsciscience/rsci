"use strict";
const ee = require('event-emitter');
const debug = require('debug')('RSCI.experiment.base');
const io = require('debug')('RSCI.experiment.io');
var helpers = require('./helpers');

var base = class base {
  constructor(sessionId, experiment) {
    this.id = sessionId;
    this.init = initialize;
    this.config = experiment.sessionVariables;
    this.experiment = experiment
    var uiListens = [];
    
    function initialize(clientCommunicationFunctions) {
      debug('initialize');
      this.uiCalls = clientCommunicationFunctions;
      this.state = {};
      this.state.ignoreExtraneousInputs = false;
      this.uiCalls.start({ id: this.id });
      this.emit('init', { actionTimeStamp: new Date(), actionType: 'init' });
      //session starts on UI_onReady 
    };

    var addUIListner = function(name,fun){
      uiListens.push({name:name , fun: fun } );
    } 

    var despenseFood = function(){
      io.despenseFood(); 
    }

    var UI_onReady = function () {
      // on start after the ui is ready to go.
      this.uiCalls.start({ id: this.id });
      this.emit('Start', { actionTimeStamp: new Date(), actionType: 'Start' });
      changeSceneTo(1);
      setTimeout(sessionStopping, this.config.duration);
    }.bind(this);

    var changeSceneTo = function (newScene) {
      this.state.currentScene = newScene;
      doEvent('ChangeToScene' + newScene);
    }.bind(this);

     this.listen = function (incomingMessage) {
            debug('listen');
            record(incomingMessage.type)
            this.state[incomingMessage.type]++;
            debug(incomingMessage.type);

            if (this.state.ignoreExtraneousInputs === true) {
                return;
            }
            //look for system actions
            switch (incomingMessage.type) {
                case 'UI_onReady': UI_onReady(); break;
            }
            //try to respond tou user defined actions
            for(var i = 0 ; i < uiListens.length; i++){
              if(incomingMessage ===  uiListens[i].name ){
                uiListens[i].fun();
              }
            }

      }.bind(this);

    var sessionStopping = function () {
      debug('sessionStopping');
      //server
      this.emit('Stop', { actionTimeStamp: new Date(), actionType: 'Stop' });
      this.emit('Dispose', { actionTimeStamp: new Date(), actionType: 'Dispose' });
      //client
      this.uiCalls.stop({ id: this.id });
      this.uiCalls.dispose({ id: this.id });

    }.bind(this);

    var record = function (action) {
      this.emit('Action', { actionTimeStamp: new Date(), actionType: action });
    }

    var doEvent = function (actionType) {
      debug('doEvent:' + actionType);
      record(actionType );
          this.uiCalls.emitAction({ type: actionType });
      }.bind(this);

  };

};

ee(base.prototype); 

module.exports = init;
