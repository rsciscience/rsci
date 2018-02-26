"use strict";

const debug = require('debug')('RSCI.API.');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

this.app= express();

this.server = require('http').Server(this.app);
this.io = require('socket.io')(this.server,{transports: ['polling', 'websocket']});

this.io.on('connection', function (socket) {
  socket.on('client_experiment_onevent', function (data) {
    if (this.externalExperimentSessionListen) {
      this.externalExperimentSessionListen(data);
    } else {
      throw ( 'No externalExperimentSession Listen' );
    }
  }.bind(this));
}.bind(this));

this.getClientCommunicationFunctions = function (listen) {
  debug('getClientCommunicationFunctions');
  this.externalExperimentSessionListen = listen;
  return {
    init: (data) => { this.io.emit('client_experiment_init', data)}, 
    start: (data) => { this.io.emit('client_experiment_session_start', data)},
    stop: (data) => { this.io.emit('client_experiment_session_stop', data)},
    dispose: (data) => { this.io.emit('client_experiment_dispose', data)},
    emitAction: (action) => { this.io.emit('client_experiment_action', action)},
  }
};

this.app.use(bodyParser.urlencoded({
  extended: true
}));
this.app.use(bodyParser.json())
this.Objectstate = {};

this.app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
this.app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();

});

this.app.get('/discovery',discovery.bind(this));
this.app.get('/discovery/list',discovery_list.bind(this));
this.app.get('/client/state',client_state.bind(this));
this.app.post('/client',client.bind(this));
this.app.post('/client/experiment/init',client_experiment_init.bind(this));
this.app.post('/client/experiment/stop',client_experiment_stop.bind(this));
this.app.post('/client/server/register',client_server_register.bind(this));

this.app.get('/server/network',server_network.bind(this));
this.app.get('/server/experiments/sessions',server_experiments_sessions.bind(this));
this.app.get('/server/experiments/list',server_experiments_list.bind(this))
this.app.post('/server/client/add',server_client_add.bind(this));
this.app.post('/server/register',server_register.bind(this))
this.app.post('/server/experiment/:id/start',server_experiment_start.bind(this));
this.app.post('/server/experiment/:id/session/:sessionId/:clientId/event',server_experiment_id_event.bind(this));



this.init = function(port, props , onUpdateParrentState, clientFunctions, serverFunctions ) {
  this.state = props;
  this.onUpdateParrentState = onUpdateParrentState;
  this.clientFunctions = clientFunctions;
  this.serverFunctions = serverFunctions;
  this.server.listen(port,  '0.0.0.0', function() {
    debug("... API up");
  });
};

this.setProps = function(props) {
  debug('setProps ');
  this.state.discoveryList = props.discoveryList;

};


function client_state (req, res)  {
  debug('API:client_state');
  function doWork(){

    var output = {
      server: this.state.server,
      me:this.state.me,
      experimentSessionsLocal:this.state.experimentSessionsLocal
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

function server_network (req, res)  {
  debug('API:server_network');
  function doWork(){


    var output = {
      server: this.state.server,
      me:this.state.me,
      discoveryList: this.state.discoveryList,
      clientList: this.state.clientList,
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

function server_experiments_sessions (req, res)  {
  debug('API:server_experiments_sessions');
  function doWork(){

    var output = this.state.experimentSessions;
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
      id: this.state.clientId,
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
      id: this.state.clientId,
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


function client(req, res)  {
  debug('API:client');

  function doWork(input){
    var output = this.clientFunctions.updateSettings(input);
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


function client_experiment_init(req, res)  {
  debug('API:client_experiment_init_event');

  function doWork(input){
    var output = this.clientFunctions.initExperimentSession(input);
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

function client_server_register(req, res)  {
  debug('API:client_server_register');

  function doWork(input){
    var output = this.clientFunctions.registerServer(input);
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

function server_experiments_list(req, res)  {
  debug('API:server_experiments_list');

  function doWork(input){
    var output = this.serverFunctions.experimentsList();
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

function server_experiment_start(req, res)  {
  debug('API:server_experiment_start_event');

  function doWork(input){

    var output = this.serverFunctions.startExperiment(input);
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

function server_register(req, res)  {
  debug('API:server_register');

  function doWork(input){
    var output = this.serverFunctions.register();
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


function client_experiment_stop(req, res) {
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


function server_experiment_id_event(req, res)  {
  //watch all client events
  debug('API:server_experiment_id_event');

  function doWork(sessionId, expId, clientId, input){

    var output = this.serverFunctions.processExperimentSessionEvent(sessionId,expId , clientId, input);
    return  JSON.stringify(output);
  }

  var clientResponse = {}

  try{
    clientResponse =  doWork.bind(this,req.params.sessionId ,req.params.id,req.params.clientId, req.body)();
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return;
  }

  res.send(clientResponse);

  this.io.emit('server_experiment_id_event', req.body);

  res.status(200).send();
}

module.exports = this;






