"use strict";

const express = require('express')
var bodyParser = require('body-parser')

this.app= express();
this.app.use(bodyParser.urlencoded({
  extended: true
}));
this.app.use(bodyParser.json())
this.Objectstate = {};

this.app.get('/discovery',discovery.bind(this));
this.app.get('/discovery/list',discovery_list.bind(this));
this.app.post('/client/job/:id/start',client_job_start.bind(this));
this.app.post('/client/job/:id/stop/start',client_job_start.bind(this));
this.app.post('/server/job/:id/:clientId/event',server_job_id_event.bind(this));


this.init = function(port, props , onUpdateParrentState ) {
    this.state = props;
    this.onUpdateParrentState = onUpdateParrentState;
    this.app.listen(port, () => console.log('Web Api up on port ' + port));
};

this.setProps = function(props) {
    console.log('WebApp - setProps ');
    this.state.discoveryList = props.discoveryList;

};


function discovery (req, res)  {
    console.log('API:discovery');
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

    console.log('API:discovery_list');
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

function server_job_id_event(req, res)  {
    console.log('API:server_job_id_event');

    var job = {
        id: req.params.id,
        clients:[]
    }
    var knownJob = false;
    for (var i = 0, len = this.state.jobs.length; i < len; i++) {
        
        if(req.params.id == this.state.jobs[i].id){
            job = this.state.jobs[i];
            knownJob = true;
            break;
        }
    }

    if(!knownJob){
        this.state.jobs.push(job);
    }


    var clients = job.clients;

    var client = {id:req.params.clientId,actions:[]}
    var knownClient = false;
    for (var i = 0, len = clients.length; i < len; i++) {
        if(req.params.clientId == clients[i].id){
            client= clients[i];
            knownClient = true;
            break;
        }
    }
    if(!knownClient){
        clients.push(client);
    }
    var actions = client.actions;
    actions.push(req.body);

    this.onUpdateParrentState(this.state);

    res.status(200).send();
}

module.exports = this;






