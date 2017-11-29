"use strict";

const debug = require('debug')('RSCI.webApp.');
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
this.app.get('/client/state',client_state.bind(this));
this.app.post('/client/job/start',client_job_start.bind(this));
this.app.post('/client/job/:id/stop',client_job_stop.bind(this));
this.app.post('/server/client/add',server_client_add.bind(this));
this.app.post('/server/job/start',server_job_start.bind(this));
this.app.post('/server/job/:id/:clientId/event',server_job_id_event.bind(this));



this.init = function(port, props , onUpdateParrentState, clientFunctions, serverFunctions ) {
    this.state = props;
    this.onUpdateParrentState = onUpdateParrentState;
    this.clientFunctions = clientFunctions;
    this.serverFunctions = serverFunctions;
    this.app.listen(port, () => debug('Web Api up on port ' + port));
};

this.setProps = function(props) {
    debug('setProps ');
    this.state.discoveryList = props.discoveryList;

};

function client_state (req, res)  {
    debug('API:client_state');
    function doWork(){
        var output = this.state;
        return  JSON.stringify( output);
    };

    var clientResponse = {}

    try{
        clientResponse =  doWork.bind(this)();
    }catch (ex) {
        debug(ex);
        res.status(500).send('Something broke!')
        return ;
    }

    res.send(clientResponse);
}

function discovery (req, res)  {
    debug('API:discovery');
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
        debug(ex);
        res.status(500).send('Something broke!')
        return ;
    }

    res.send(clientResponse);
}

function discovery_list (req, res)  {

    debug('API:discovery_list');
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
        debug(ex);
        res.status(500).send('Something broke!')
        return;
    }

    res.send(clientResponse);
}

function client_job_start(req, res)  {
    debug('API:client_job_start_event');

    function doWork(input){
        
        var output = this.clientFunctions.startJob(input.jobId);
            return  JSON.stringify( output);
        }
    
        var clientResponse = {}
    
        try{
            clientResponse =  doWork.bind(this, req.body)();
        }catch (ex) {
            debug(ex);
            res.status(500).send('Something broke!')
            return;
        }
    
        res.send(clientResponse);
    }
    
function server_job_start(req, res)  {
    debug('API:server_job_start_event');

    function doWork(input){
        
        var output = this.serverFunctions.startJob(input.jobId);
            return  JSON.stringify( output);
        }
    
        var clientResponse = {}
    
        try{
            clientResponse =  doWork.bind(this, req.body)();
        }catch (ex) {
            debug(ex);
            res.status(500).send('Something broke!')
            return;
        }
    
        res.send(clientResponse);
    }

function client_job_stop(req, res) {
    res.status(500).send();
}

function server_client_add(req, res)  {
    debug('API:server_client_add');

    function doWork(input){
        
        var output = this.serverFunctions.addClient(input);
            return  JSON.stringify(output);
        }
    
        var clientResponse = {}
    
        try{
            clientResponse =  doWork.bind(this, req.body)();
        }catch (ex) {
            debug(ex);
            res.status(500).send('Something broke!')
            return;
        }
    
        res.send(clientResponse);
    }

function server_job_id_event(req, res)  {
    debug('API:server_job_id_event');

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






