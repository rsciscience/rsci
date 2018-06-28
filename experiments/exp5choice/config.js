"use strict";

module.exports = {
    id:'exp5Choice',
    version: '1.0.0',
    name:'5 choice',
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
        ,{
            clientId: 'Box10' ,
            name: 'Box10',
            assignedRat: 'raty07'
        },
        {
            clientId: 'box5-fvm',
            name: 'box5-fvm',
            assignedRat: 'raty07'
        }
    ]
};

