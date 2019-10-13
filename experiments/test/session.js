"use strict";

const base = require.main.require('./rsci/experiment.base');
const debug = require('debug')('RSCI.session.expTest');

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

        
      
        
    }
};

module.exports = session;

