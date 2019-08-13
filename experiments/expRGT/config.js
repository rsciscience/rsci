"use strict";

module.exports = {
    id:'expRGT',
    version: '1.0.0',
    name:'RGT',
    type:"Rat Gambeling Task",
    sessionVariables:{
        duration:60000,
        timeOutDuration:3000,
        startTaskTimeOut:5000,
        maxTrials:10,
        payoutPecent1:90,
        payoutPecent2:40,
        payoutPecent3:80,
        payoutPecent4:50,
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

