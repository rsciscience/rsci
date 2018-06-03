"use strict";

const base = require('../rsci/experiment.base.js');
const debug = require('debug')('RSCI.session.exp1979');

class session extends base {
    constructor(sessionId, experiment) {
        super(sessionId, experiment);

        // Things you can do
        // changeSceneTo(number)        : which screen to change to
        // record(action)               : record any action in the log 
        // despenseFood()               : dispense food 
        // addListners(name,function)   : wire up things that hapen on the client
        
        // Things you need to rember attatch to this.state
        // this.state.

        
        // you need to listen to for the messages from the client when the screen is pressed 
        addUIListner('Scene1TrialStartNosepoke_onclick', () => { scene1TrialStartNosepoke_onclick() });
        addUIListner('Scene2nosepokestim1_onclick', () => { callAWinner(1) });
        addUIListner('Scene2nosepokestim2_onclick', () => { callAWinner(2) });
        addUIListner('Scene2nosepokestim3_onclick', () => { callAWinner(3) });
        addUIListner('Scene2nosepokestim4_onclick', () => { callAWinner(4) });
        addUIListner('Scene2nosepokestim5_onclick', () => { callAWinner(5) });
        addUIListner('PrematureResponse1', () => { prematureResponse() });
        addUIListner('PrematureResponse2', () => { prematureResponse() });
        addUIListner('PrematureResponse3', () => { prematureResponse() });
        addUIListner('PrematureResponse4', () => { prematureResponse() });
        addUIListner('PrematureResponse5', () => { prematureResponse() });
      
        
        var prematureResponse = function () {
            clearTimeout(this.state.interTrialIntervalTimeOut);
            changeSceneTo(5);
            setTimeout(() => {
                ChangeSceneTo(1);
            }, 5000);
        }.bind(this);

        var CorrectResponseTime = function () {
            debug('Winner Winner Chicken Dinner !!!!');
            despenseFood();
            this.emit('DespenseFood', { actionTimeStamp: new Date(), actionType: 'DespenseFood' });
            changeSceneTo(3);
            setTimeout(() => {
                ChangeSceneTo(1);
            }, 1000);
        }.bind(this);

        var IncorrectResponseTime = function () {
            changeSceneTo(4);
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

        var scene1TrialStartNosepoke_onclick = function (poke) {
            this.state.interTrialIntervalTimeOut = setTimeout(() => {
                this.state.interTrialInterval = new Date();
                changeSceneTo(2);
                this.state.winningPokeHole = Math.floor(Math.random() * 5) + 1;
                debug('Next winner is poke ' + this.state.winningPokeHole);
                doEvent('NosePokeStimulus_' + this.state.winningPokeHole);
            }, 5000);
            doEvent('ITIOn');
        }.bind(this);


    };

};



module.exports = base;

