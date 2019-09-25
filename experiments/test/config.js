"use strict";

module.exports = {
    id:'Test',
    version: '1.0.0',
    name:'TestExp',
    type:"Test",
    sessionVariables:{
        SessionLengthMS:60000,
        timeOutDuration:3000,
        startTaskTimeOut:5000,
        lossPulseTimeOut:5000,
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

