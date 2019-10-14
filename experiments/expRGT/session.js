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

        nosePoke1Premature_pressed
        nosePoke2Premature_pressed
        nosePoke3Premature_pressed
        nosePoke4Premature_pressed

        **outgoing**
        ChangeToScene_start
        ChangeToScene_task
        ChangeToScene_win
        ChangeToScene_lose
        NosePokeStimulus_on_x
        NosePokeStimulus_off_x
        PulseNosePoke_on_x
        PulseNosePoke_off_x
        */

        addUIListner('startTrial_pressed', startTrial.bind(this));
        addUIListner('nosePoke1_pressed', callAWinner.bind(this, 1));
        addUIListner('nosePoke2_pressed', callAWinner.bind(this, 2));
        addUIListner('nosePoke3_pressed', callAWinner.bind(this, 3));
        addUIListner('nosePoke4_pressed', callAWinner.bind(this, 4));

        addUIListner('nosePoke1Premature_pressed', callPremature.bind(this, 1));
        addUIListner('nosePoke2Premature_pressed', callPremature.bind(this, 2));
        addUIListner('nosePoke3Premature_pressed', callPremature.bind(this, 3));
        addUIListner('nosePoke4Premature_pressed', callPremature.bind(this, 4));

        function correctResponseTime(payout, poke) {
            changeSceneTo('win');
            for (var i = 0; i < payout; i++) {
                this.state['payout'+poke+'win'] = this.state['payout'+poke+'win'] + 1; 
                let pelletCount = this.config.payout['Hole'+poke+'PelletCount'];
                for(var i = 0 ; i <=  pelletCount -1 ; i++){
                    record('dispenseFood')
                }
            }
            setTimeout(() => {
                changeSceneTo('start');
            }, 10);
        }

        function incorrectResponseTime() {
            this.state['payout'+poke+'lose'] = this.state['payout'+poke+'lose'] + 1; 
            changeSceneTo('lose');
            doEvent('beep');
            this.doEvent('PulseNosePoke_on' + poke );
            setTimeout(()=>{ 
                this.doEvent('PulseNosePoke_off' + poke );
                changeSceneTo('start');
            },this.config.lossPulseTimeOut);
        }

        function callPremature(poke){
            record('Premature Response Poke '  + poke);
            clearTimeout(this.state.interTrialIntervalTimeOut);
            changeSceneTo('lose');
            doEvent('beep');
            this.doEvent('PulseNosePoke_on' + poke );
            setTimeout(()=>{ 
                this.doEvent('PulseNosePoke_off' + poke );
                changeSceneTo('start');
            },this.config.lossPulseTimeOut);
        }

        function callAWinner(poke) {
            var percent = 0;
            doEvent('NosePokeStimulus_' + poke);
            switch (poke) {
                case 1:
                    percent = this.config.payoutPecent1;
                    break;
                case 2:
                    percent = this.config.payoutPecent2;
                    break;
                case 3:
                    percent = this.config.payoutPecent3;
                    break;
                case 4:
                    percent = this.config.payoutPecent4;
                    break;
            }
            
            var percentf = parseFloat(percent);
            var tot = parseFloat(100.00000);
            var d = Math.random();

            if (d < (percentf/tot)){
                correctResponseTime(poke);
            } else {
                incorrectResponseTime(poke);
            }

            //Record Stats
            this.state['payout'+poke+'total'] = this.state['payout'+poke+'total'] + 1;
            this.state['PayoutRates1'] = ( parseFloat(this.state['payout1win'] )/parseFloat(this.state['payout1total'] )) * 100 ; 
            this.state['PayoutRates2'] = ( parseFloat(this.state['payout2win'] )/parseFloat(this.state['payout2total'] )) * 100 ;
            this.state['PayoutRates3'] = ( parseFloat(this.state['payout3win'] )/parseFloat(this.state['payout3total'] )) * 100 ;
            this.state['PayoutRates4'] = ( parseFloat(this.state['payout4win'] )/parseFloat(this.state['payout4total'] )) * 100 ;
        }

        function startTrial() {
            setInitalStatValues();
            this.state.trialCount ++;

            if(!this.state.trialCount >= this.config.maxTrials ){
                record('MaxTrailsComplete')
                this.stop();
            }
            
            changeSceneTo('taskWait');

            this.state.interTrialIntervalTimeOut = setTimeout(() => {
                this.state.interTrialInterval = new Date();
                changeSceneTo('task');
            }, this.config.startTaskTimeOut);
        }
        
        function setInitalStatValues(){
            if(!this.state.trialCount){ this.state.trialCount = 0 ; }
            if(!this.state['payout'+poke+'total']) {this.state['payout'+poke+'total']   = 0 }
            if(!this.state['payout'+poke+'win'])   {this.state['payout'+poke+'win']     = 0 }
            if(!this.state['payout'+poke+'lose'])  {this.state['payout'+poke+'lose']    = 0 }
        }    
    }
};



module.exports = session;

