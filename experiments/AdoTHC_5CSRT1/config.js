"use strict";

module.exports = {
    id:'AdoTHC_5CSRT1',
    version: '1.0.0',
    name:'AdoTHC_5CSRT1',
    type:"5 choice",
    sessionVariables:{
        duration:10000,
        timeOutDuration:3000,
    }, 
    clientAssignments:[
        {
            clientId: 'rm1-b12' ,
            ratid:    'raty12'
        },{
            clientId: 'rm1-b03' ,
            ratid: 'raty03'
        }
    ]
};

