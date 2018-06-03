"use strict";

const base = require.main.require('./rsci/experiment.base');
const debug = require('debug')('RSCI.session.exp1979');

class session extends base {
    constructor(sessionId, experiment) {
        super(sessionId, experiment);

        // Things you can do
        // changeSceneTo(number)        : which screen to change to
        // record(action)               : record any action in the log 
        // despenseFood()               : dispense food 
        // addUIListner(name,function)  : wire up things that hapen on the client
        // doEvent(msg)                    : send message to ui 

        // Things you need to rember attatch to this.state
        // this.state.
        
        // you need to listen to for the messages from the client when the screen is pressed 
  
        console.log('session construtor');
        super.addUIListner('Scene1TrialStartNosepoke_onclick', () => { this.scene1TrialStartNosepoke_onclick() });
        super.addUIListner('Scene2nosepokestim1_onclick', () => { this.callAWinner(1) });
        super.addUIListner('Scene2nosepokestim2_onclick', () => { this.callAWinner(2) });
        super.addUIListner('Scene2nosepokestim3_onclick', () => { this.callAWinner(3) });
        super.addUIListner('Scene2nosepokestim4_onclick', () => { this.callAWinner(4) });
        super.addUIListner('Scene2nosepokestim5_onclick', () => { this.callAWinner(5) });
        super.addUIListner('PrematureResponse1', () => { this.prematureResponse() });
        super.addUIListner('PrematureResponse2', () => { this.prematureResponse() });
        super.addUIListner('PrematureResponse3', () => { this.prematureResponse() });
        super.addUIListner('PrematureResponse4', () => { this.prematureResponse() });
        super.addUIListner('PrematureResponse5', () => { this.prematureResponse() });
        
       

       
       
    }

     prematureResponse  () {
        clearTimeout(this.state.interTrialIntervalTimeOut);
        super.changeSceneTo(5);
        setTimeout(() => {
            super.changeSceneTo(1);
        }, 5000);
    }

      correctResponseTime  () {
        debug('Winner Winner Chicken Dinner !!!!');
        super.despenseFood();
        super.record('DespenseFood')
        super.changeSceneTo(3);
        setTimeout(() => {
            super.changeSceneTo(1);
        }, 1000);
    }

     incorrectResponseTime  () {
        super.changeSceneTo(4);
        setTimeout(() => {
            super.changeSceneTo(1);
        }, 10000);
    }

     callAWinner  (poke) {
        if (this.state.winningPokeHole === poke) {
            this.correctResponseTime();
        } else {
            this.incorrectResponseTime();
        }
    }

     scene1TrialStartNosepoke_onclick  (poke) {
        this.state.interTrialIntervalTimeOut = setTimeout(() => {
            this.state.interTrialInterval = new Date();
            super.changeSceneTo(2);
            this.state.winningPokeHole = Math.floor(Math.random() * 5) + 1;
            debug('Next winner is poke ' + this.state.winningPokeHole);
            super.doEvent('NosePokeStimulus_' + this.state.winningPokeHole);
        }, 5000);
        super.doEvent('ITIOn');
    }



};



module.exports = session;

