"use strict";

module.exports = {
    id:'exp5Choice',
    version: '1.0.0',
    name:'5 choice',
    type:"5 choice",
    sessionVariables:{
        sessionLengthMS:60000, //Required
        maxNumberOfTrials:100,
        interTrialDelayMS:5000,
        stimulusDuration:1000,
        decisionDuration:10000,
        incorrectResponseTimeout:3000,
        omittedResponseTimeOut:3000,
    }, 
    clientAssignments:[
        {
            clientId: 'Box1' ,
            name: 'davidvm',
            assignedRat:    'rat_002'
        },{
            clientId: 'Box2' ,
            name: 'majortom',
            assignedRat: 'rat_003'
        }
        ,{
            clientId: 'Box3' ,
            name: 'Box3',
            assignedRat: 'rat_001'
        }    
    ]
};

