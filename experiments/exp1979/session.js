"use strict";
var ee = require('event-emitter');
const debug = require('debug')('RSCI.session.exp1979');

var base = class base {
    constructor(sessionId, experiment) {
        this.id = sessionId;
        this.init = initialize;
        this.config = experiment.sessionConfig;
        this.experiment = experiment

        function initialize(clientCommunicationFunctions) {
            debug('initialize');
            this.uiCalls = clientCommunicationFunctions;
            this.state = {};
            this.state.ignoreExtraneousInputs = false;
            this.uiCalls.start({ id: this.id });
            this.emit('init', { actionTimeStamp: new Date(), actionType: 'init' });
            //session starts on UI_onReady 
        };

        var prematureResponse = function () {
            clearTimeout(this.state.interTrialIntervalTimeOut);
            ChangeSceneTo(5);
            setTimeout(() => {
                ChangeSceneTo(1);
            }, 5000);
        }.bind(this);

        var ChangeSceneTo = function (newScene) {
            this.state.currentScene = newScene;
            doEvent('ChangeToScene' + newScene);
        }.bind(this);

        var CorrectResponseTime = function () {
            debug('Winner Winner Chicken Dinner !!!!');
            ChangeSceneTo(3);
            setTimeout(() => {
                ChangeSceneTo(1);
            }, 1000);
        }.bind(this);

        var IncorrectResponseTime = function () {
            ChangeSceneTo(4);
            setTimeout(() => {
                ChangeSceneTo(1);
            }, 10000);
        }.bind(this);

        var callAWinner = function (poke) {
            if (this.state.winningPokeHole === poke) {
                CorrectResponseTime();
            } else {
                IncorrectResponseTime();
            }
        }.bind(this);

        var UI_onReady = function () {
            // on start after the ui is ready to go.
            this.uiCalls.start({ id: this.id });
            this.emit('Start', { actionTimeStamp: new Date(), actionType: 'Start' });
            ChangeSceneTo(1);
            setTimeout(sessionStopping, this.config.duration);
        }.bind(this);

        var sessionStopping = function(){
            debug('sessionStopping');
            //server
            this.emit('Stop', { actionTimeStamp: new Date(), actionType: 'Stop' });
            this.emit('Dispose', { actionTimeStamp: new Date(), actionType: 'Stop' });
            //client
            this.uiCalls.stop({ id: this.id });
            this.uiCalls.dispose({ id: this.id });

        }.bind(this);

        var Scene1TrialStartNosepoke_onclick = function (poke) {
            this.state.interTrialIntervalTimeOut = setTimeout(() => {
                this.state.interTrialInterval = new Date();
                ChangeSceneTo(2);
                this.state.winningPokeHole = Math.floor(Math.random() * 5) + 1;
                debug('Next winner is poke ' + this.state.winningPokeHole);
                doEvent('nosepokeStimulus_' + this.state.winningPokeHole);
            }, 5000);
            doEvent('ITIOn');
        }.bind(this);

        this.listen = function (incomingMessage) {
            debug('listen');
            this.emit('Action', { actionTimeStamp: new Date(), actionType: incomingMessage.type });
            this.state[incomingMessage.type]++;
            debug(incomingMessage.type);

            if (this.state.ignoreExtraneousInputs === true) {
                return;
            }
            switch (incomingMessage.type) {
                case 'UI_onReady': UI_onReady(); break;
                case 'Scene1TrialStartNosepoke_onclick': Scene1TrialStartNosepoke_onclick(); break;
                case 'Scene2nosepokestim1_onclick': callAWinner(1); break;
                case 'Scene2nosepokestim2_onclick': callAWinner(2); break;
                case 'Scene2nosepokestim3_onclick': callAWinner(3); break;
                case 'Scene2nosepokestim4_onclick': callAWinner(4); break;
                case 'Scene2nosepokestim5_onclick': callAWinner(5); break;
                case 'prematureResponse1':
                case 'prematureResponse2':
                case 'prematureResponse3':
                case 'prematureResponse4':
                case 'prematureResponse5':
                    prematureResponse();
                break;
                default: debug('unknown action recived ' + incomingMessage.type); break;

        }
        }.bind(this);

        var doEvent = function (actionType) {
            debug('doEvent:' + actionType);
            this.emit('Action', { actionTimeStamp: new Date(), actionType: actionType });
            this.uiCalls.emitAction({ type: actionType });
        }.bind(this);
    };

};

ee(base.prototype); 


module.exports = base;

