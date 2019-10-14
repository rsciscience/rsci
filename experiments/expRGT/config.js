"use strict";

module.exports = {
    id:'expRGT',
    version: '1.0.0',
    name:'rGT',
    type:"Rat Gambling Task",
    sessionVariables:{
        sessionLengthMS:60000, //Required 
        timeOutDuration:3000,
        startTaskTimeOut:5000,
        lossPulseTimeOut:5000,
        maxTrials:999999,
        Hole1PayoutPecent:90,
        Hole1Timeout:5000,
        Hole1PelletCount:1,
        Hole2PayoutPecent:40,
        Hole2Timeout:40000,
        Hole2PelletCount:4,
        Hole3PayoutPecent:80,
        Hole3Timeout:10000,
        Hole3PelletCount:2,
        Hole4PayoutPecent:50,
        Hole4Timeout:30000,
        Hole4PelletCount:3,
    }, 
    clientAssignments:[
        {
            clientId: 'box3' ,
            name: '3',
            assignedRat:    'raty1'
        },
        {
            clientId: 'Box4' ,
            name: 'Box4',
            assignedRat: 'raty04'
        },
        {
            clientId: 'box5-fvm',
            name: 'box5-fvm',
            assignedRat: 'raty07'
        }
    ]
};

