"use strict";

const base = require.main.require('./rsci/experiment.base');
const debug = require('debug')('RSCI.session.exp1979');

class session extends base {
    constructor(sessionId, experiment) {
        // things to ignore : wire up 
        super(sessionId, experiment);
        var changeSceneTo = function (scene) { this.changeSceneTo(scene); }.bind(this);
        var record = function (action) { this.record(action); }.bind(this);
        var dispenseFood = function () { this.dispenseFood(); }.bind(this);
        var addUIListner = function (name, fun) { this.addUIListner(name, fun); }.bind(this);
        var doEvent = function (msg) { this.doEvent(msg); }.bind(this);
        this.state = {};
        // things to ignore : done
           
        
        /*

            __QQ
           (_)_">  HELP
          _)    

        Things you can do
            changeSceneTo(scene)         : which screen to change to
            record(action)               : record any action in the log 
            despenseFood()               : dispense food 
            addUIListner(name,function)  : wire up things that hapen on the client
            doEvent(msg)                 : send message to ui 

        Things you need to remember attach to this.state e.g
            this.state.nextPoke = 3 ;
            this.state.didWin = true;

        */    


        /*
                                          _        _               
             _ _ ___ _ _ ___    ___ ___ _| |___   | |_ ___ ___ ___ 
            | | | . | | |  _|  |  _| . | . | -_|  |   | -_|  _| -_|
            |_  |___|___|_|    |___|___|___|___|  |_|_|___|_| |___|
            |___|   

        */
        // You need to listen to for the messages from the client when the screen is pressed 
        addUIListner('scene1TrialStartNosepoke_onclick', scene1TrialStartNosepoke_onclick.bind(this));
        addUIListner('scene2nosepokestim1_onclick', callAWinner.bind(this,1));
        addUIListner('scene2nosepokestim2_onclick', callAWinner.bind(this,2));
        addUIListner('scene2nosepokestim3_onclick', callAWinner.bind(this,3));
        addUIListner('scene2nosepokestim4_onclick', callAWinner.bind(this,4));
        addUIListner('scene2nosepokestim5_onclick', callAWinner.bind(this,5));
        addUIListner('prematureResponse1', prematureResponse.bind(this));
        addUIListner('prematureResponse2', prematureResponse.bind(this));
        addUIListner('prematureResponse3', prematureResponse.bind(this));
        addUIListner('prematureResponse4', prematureResponse.bind(this));
        addUIListner('prematureResponse5', prematureResponse.bind(this));

        function prematureResponse() {
            clearTimeout(this.state.interTrialIntervalTimeOut);
            changeSceneTo(5);
            setTimeout(() => {
                changeSceneTo(1);
            }, 5000);
        }

        function correctResponseTime() {
            debug('Winner Winner Chicken Dinner !!!!');
            despenseFood();
            record('DespenseFood')
            changeSceneTo(3);
            setTimeout(() => {
                changeSceneTo(1);
            }, 1000);
        }

        function incorrectResponseTime() {
            changeSceneTo(4);
            setTimeout(() => {
                changeSceneTo(1);
            }, 10000);
        }

        function callAWinner(poke) {
            if (this.state.winningPokeHole === poke) {
                dispenseFood(); 
                correctResponseTime();
            } else {
                incorrectResponseTime();
            }
        }

        function scene1TrialStartNosepoke_onclick(poke) {
            this.state.interTrialIntervalTimeOut = setTimeout(() => {
                this.state.interTrialInterval = new Date();
                changeSceneTo(2);
                this.state.winningPokeHole = Math.floor(Math.random() * 5) + 1;
                debug('Next winner is poke ' + this.state.winningPokeHole);
                doEvent('NosePokeStimulus_' + this.state.winningPokeHole);
            }, 5000);
            doEvent('ITIOn');
        }

    
    }
};



module.exports = session;

