"use strict";
const ee = require('event-emitter');
const debug = require('debug')('RSCI.experiment.base');
const io = require('debug')('RSCI.experiment.io');
var helpers = require('./helpers');

var base = class base {

  constructor(sessionId, experiment) {
    this.id = sessionId;
    this.config = experiment.sessionVariables;
    this.experiment = experiment
    this.uiListens = [];
    this.sessionStopping  = function () {
      debug('sessionStopping');
      //server
      this.state.ignoreExtraneousInputs = true;
      this.emit('Stop', { actionTimeStamp: new Date(), actionType: 'Stop' });
      this.emit('Dispose', { actionTimeStamp: new Date(), actionType: 'Dispose' });
      //client
      this.uiCalls.stop({ id: this.id });
      this.uiCalls.dispose({ id: this.id });
    }.bind(this);
  }

  init(clientCommunicationFunctions) {
    debug('initialize');
    this.uiCalls = clientCommunicationFunctions;
    this.state = {};
    this.state.ignoreExtraneousInputs = false;
    this.uiCalls.start({ id: this.id });
    this.emit('init', { actionTimeStamp: new Date(), actionType: 'init' });
    //session starts on UI_onReady 
  }

  addUIListner(name, fun) {
    debug('addUIListner');
    this.uiListens.push({ name: name, fun: fun });
  }

  despenseFood() {
    debug('despenseFood');
    io.despenseFood();
  }

  UI_onReady() {
    debug('UI_onReady');
    // on start after the ui is ready to go.
    this.uiCalls.start({ id: this.id });
    this.emit('Start', { actionTimeStamp: new Date(), actionType: 'Start' });
    this.changeSceneTo(1);
    setTimeout(this.sessionStopping, this.config.duration);
  } 

  changeSceneTo  (newScene) {
    debug('changeSceneTo');
    this.state.currentScene = newScene;
    this.doEvent('ChangeToScene' + newScene);
  }

   listen (incomingMessage) {
     console.log(this);
    debug('listen');
    this.record(incomingMessage.type);
    this.state[incomingMessage.type]++;
    debug('incomingMessage: ' + incomingMessage.type);

    if (this.state.ignoreExtraneousInputs === true) {
      return;
    }
    //look for system actions
    console.log(incomingMessage.type);
    switch (incomingMessage.type.toUpperCase()) {
      case 'UI_onReady'.toUpperCase(): this.UI_onReady(); break;
    }
    //try to respond tou user defined actions
    for (var i = 0; i < this.uiListens.length; i++) {
      if (incomingMessage.type.toUpperCase() === this.uiListens[i].name.toUpperCase()) {
        this.uiListens[i].fun();
        debug('Found user function');
      }
    }

  }

  record  (action) {
    debug('record');
    this.emit('Action', { actionTimeStamp: new Date(), actionType: action });
  }

   doEvent  (actionType) {
    debug('doEvent:' + actionType);
    this.record(actionType);
    this.uiCalls.emitAction({ type: actionType });
   }



};

ee(base.prototype); 

module.exports = base;
