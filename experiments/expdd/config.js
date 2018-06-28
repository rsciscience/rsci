"use strict";

module.exports = {
    id:'expDD',
    version: '1.0.0',
    name:'Delayed Discounting',
    type:"Delayed Dicounting",
    sessionVariables:{
        duration:60000,
        timeOutDuration:3000,
        startTaskTimeOut:5000,
        maxTrials:10,
        payoutPecent1:90,
        payoutPecent2:80,
        payoutPecent3:50,
        payoutPecent4:20,
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
        }
    ]
};

