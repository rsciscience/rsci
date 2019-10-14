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
        this.state = {trialCount:0}
      
        // things to ignore : done
        
        /*

            __QQ
           (_)_">  HELP
          _)    

        Things you can do
            changeSceneTo(scene)         : which screen to change to
            record(action)               : record any action in the log 
            dispenseFood()               : dispense food 
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
        addUIListner('pokestart', pokeStart.bind(this));
        addUIListner('poke1', callAWinner.bind(this,1));
        addUIListner('poke2', callAWinner.bind(this,2));
        addUIListner('poke3', callAWinner.bind(this,3));
        addUIListner('poke4', callAWinner.bind(this,4));
        addUIListner('poke5', callAWinner.bind(this,5));
        addUIListner('prematureResponse1', prematureResponse.bind(this,1));
        addUIListner('prematureResponse2', prematureResponse.bind(this,2));
        addUIListner('prematureResponse3', prematureResponse.bind(this,3));
        addUIListner('prematureResponse4', prematureResponse.bind(this,4));
        addUIListner('prematureResponse5', prematureResponse.bind(this,5));

        function omittedResponse(val) {
            debugger;
            record('Omitted Response')
            changeSceneTo('incorect')
            setTimeout(() => {
                startTrial()
            }, this.config.incorrectResponseTimeout);
        }

        function prematureResponse(val) {
            clearTimeout(this.state.interTrialIntervalTimeOut)
            record('Premature Response ')
            changeSceneTo('incorect')
            setTimeout(() => {
                startTrial()
            }, this.config.incorrectResponseTimeout);
        }

        function correctResponse() {
            debug('Winner Winner Chicken Dinner !!!!')
            record('Correct Response ')
            dispenseFood()
            record('dispenseFood')
            startTrial()
        }

        function incorrectResponse() {
            record('Incorrect Response')
            changeSceneTo('incorect')
            setTimeout(() => {
                startTrial()
            }, this.config.incorrectResponseTimeout);
        }

        function callAWinner(poke) {
            clearTimeout(this.state.decisionTimeOut)
            if (this.state.winningPokeHole === poke) {
                correctResponse()
            } else {
                incorrectResponse()
            }
        }

        function startTrial() {
            changeSceneTo('start');
        }

        function pokeStart(poke) {

            this.state.trialCount ++;

            if(!this.state.trialCount >= this.config.maxNumberOfTrials ){
                record('maxNumberOfTrials')
                this.stop();
            }

            changeSceneTo('premature')
            
            this.state.interTrialIntervalTimeOut = setTimeout(() => {
                
                changeSceneTo('stimulas');
                this.state.interTrialInterval = new Date();
                this.state.winningPokeHole = Math.floor(Math.random() * 5) + 1;
                debug('Next winner is poke ' + this.state.winningPokeHole);
                doEvent('NosePokeStimulus_off_all');
                doEvent('NosePokeStimulus_on_' + this.state.winningPokeHole);
               
                setTimeout(() => {
                    doEvent('NosePokeStimulus_off_all');
                    this.state.decisionTimeOut = setTimeout( ()=>{
                        debugger;
                        omittedResponse.bind(this)()
                    }, this.config.decisionDuration)

                },this.config.stimulusDuration)

            }, this.config.interTrialDelayMS);
            
        }
    }
};

module.exports = session;

