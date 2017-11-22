"use strict";

const express = require('express')


this.app= express();
this.Objectstate = {};

this.app.get('/discovery',discovery.bind(this));
this.app.get('/discovery/list',discovery_list.bind(this));
this.app.post('/client/job/:id/start',client_job_start.bind(this));
this.app.post('/client/job/:id/stop/start',client_job_start.bind(this));
this.app.post('/server/job/:id/clientEvent',server_job_clinetEvent.bind(this));


this.init = function(port, props , onUpdateParrentState ) {
    this.state = props;
    this.onUpdateParrentState = onUpdateParrentState;
    this.app.listen(3000, () => console.log('Example app listening on port 3000!'));
};

this.setProps = function(props) {
    console.log('WebApp - setProps ');
    this.state.discoveryList = props.discoveryList;
    
};


function discovery (req, res)  {
    console.log('discovery');
    function doWork(){
        var output =    {
            id: this.state.id,
            initTimeStamp: this.state.initTimeStamp
        };
        return  JSON.stringify( output);
    };
    
    var clientResponse = {}

    try{
       clientResponse =  doWork.bind(this)();
    }catch (ex) {
        console.log(ex);
        res.status(500).send('Something broke!')
        return ;

    }

    res.send(clientResponse);
}

function discovery_list (req, res)  {
    
    console.log('discovery_list');
   function doWork(){

        var output =    {
            id: this.state.id,
            initTimeStamp: this.state.initTimeStamp,
            discoveryList : this.state.discoveryList
        };
        return  JSON.stringify( output);
    }
    
    var clientResponse = {}

    try{
       clientResponse =  doWork.bind(this)();
    }catch (ex) {
        console.log(ex);
        res.status(500).send('Something broke!')
        return;
    }

    res.send(clientResponse);
}

function client_job_start(req, res)  {
    res.status(500).send();
}

function client_job_stop(req, res) {
    res.status(500).send();
}

function server_job_clinetEvent(req, res)  {
    res.status(500).send();
}

module.exports = this;






