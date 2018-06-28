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
        /* 
        **incomming**
        startTrial   
        nosePoke1_pressed
        nosePoke2_pressed
        nosePoke3_pressed
        nosePoke4_pressed


        **outgoing**
        ChangeToScene_start
        ChangeToScene_task
        ChangeToScene_win
        ChangeToScene_lose
        NosePokeStimulus_1
        NosePokeStimulus_2
        NosePokeStimulus_3
        NosePokeStimulus_4
        */
            

        addUIListner('startTrial_pressed', startTrial.bind(this));
        addUIListner('nosePoke1_pressed', callAWinner.bind(this,1));
        addUIListner('nosePoke2_pressed', callAWinner.bind(this,2));
        addUIListner('nosePoke3_pressed', callAWinner.bind(this,3));
        addUIListner('nosePoke4_pressed', callAWinner.bind(this,4));
        

        function correctResponseTime(payout) {
            changeSceneTo('win');
            for(var i=0 ; i < payout; i++){
                dispenseFood();
                record('dispenseFood')
            }
            setTimeout(() => {
                changeSceneTo('start');
            }, 1000);
        }

        function incorrectResponseTime() {
            changeSceneTo('lose');
            setTimeout(() => {
                changeSceneTo('start');
            },5000 );
        }

        function callAWinner(poke) {
            var percent = 0;
            var payout = 0 ; 
            doEvent('NosePokeStimulus_' + this.state.winningPokeHole);
            switch(poke){
                case 1 : break; 
                    percent = this.config.payoutPecent1;
                    payout = 1;
                case 2 : break; 
                    percent = this.config.payoutPecent2;
                    payout = 2;
                case 3 : break;
                    percent = this.config.payoutPecent3;
                    payout = 3;
                case 4 : break; 
                    percent = this.config.payoutPecent4; 
                    payout = 4;
            }

            var d = Math.random();
            this.state['payout'+poke+'total'] = this.state['payout'+poke+'total'] + 1; 
            if (d < (percent/100)){
                correctResponseTime(payout);
                this.state['payout'+poke+'win'] = this.state['payout'+poke+'win'] + 1; 
            } else {
                incorrectResponseTime();
                this.state['payout'+poke+'win'] = this.state['payout'+poke+'lose'] + 1; 
            }

            record('Payout Rates' + '1:' + ( this.state['payout1win'] /this.state['payout1total'] )* 100 )
            record('Payout Rates' + '2:' + ( this.state['payout2win'] /this.state['payout2total'] )* 100 )
            record('Payout Rates' + '3:' + ( this.state['payout3win'] /this.state['payout3total'] )* 100 )
            record('Payout Rates' + '4:' + ( this.state['payout4win'] /this.state['payout4total'] )* 100 )

        }

        function startTrial(poke) {
            if(!this.state.trialCount){
                this.state.trialCount = 0 ;
            }
            this.state.trialCount ++;

            if(!this.state.trialCount >= this.config.maxTrials ){
                record('MaxTrailsComplete')
                this.stop()  ;
            }

            this.state.interTrialIntervalTimeOut = setTimeout(() => {
                this.state.interTrialInterval = new Date();
                changeSceneTo('task');
            }, this.config.startTaskTimeOut);
        }
    
    }
};



module.exports = session;

