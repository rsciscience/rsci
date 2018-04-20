"use strict";

module.exports = {
    id:'AdoTHC_5CSRT1',
    version: '1.0.0',
    name:'AdoTHC_5CSRT1',
    type:"5 choice",
    sessionVariables:{
        duration:60000,
        timeOutDuration:3000,
    }, 
    clientAssignments:[
        {
            clientId: 'davidvm' ,
            name: 'davidvm',
            assignedRat:    'raty12'
        },{
            clientId: 'majortom' ,
            name: 'majortom',
            assignedRat: 'raty03'
        }
        ,{
            clientId: 'Box4' ,
            name: 'Box4',
            assignedRat: 'raty04'
        }
    ]
};

