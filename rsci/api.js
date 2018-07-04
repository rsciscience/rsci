"use strict";

const debug = require('debug')('RSCI.API');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const api_client = require('./api.client');
const api_server = require('./api.server');
const api_export = require('./api.export');
this.state = require('./state');

this.app= express();

this.heartbeat = {
  ts: null,
  response: false,
  callback: null,
  intervalHandle: null
}

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
  socket.on('heartbeat_response', function () {
    this.heartbeat.response = true;
    this.heartbeat.ts = new Date();
    this.heartbeat.callback(this.heartbeat.response);
  }.bind(this));
}.bind(this));

this.startUiHeartbeat = function(cb) {
  debug('startUiHeartbeat');
  this.heartbeat.callback = cb;
  var check = () => {
    this.io.emit('heartbeat_check');
    this.heartbeat.response = false;
    this.heartbeat.callback(this.heartbeat.response);
  };
  
  this.heartbeat.intervalHandle = setInterval(check, 60000);

  setTimeout(check, 5000);

}

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

this.app.get('/client/state', api_client.getState);
this.app.post('/client',api_client.root);
this.app.post('/client/experiment/init',api_client.experiment_init);
this.app.post('/client/experiment/stop',api_client.experiment_stop);
this.app.post('/client/server/register',api_client.server_register);

this.app.get('/server/network',api_server.network);
this.app.post('/server/network/rescan',api_server.network_rescan);
this.app.get('/server/experiments/sessions',api_server.experiments_sessions);
this.app.get('/server/experiments/list',api_server.experiments_list);
this.app.post('/server/experiments/reload',api_server.experiments_reload);
this.app.post('/server/client/add',api_server.client_add);
this.app.post('/server/client/updateClientID',api_server.updateClientID);
this.app.post('/server/register',api_server.register);
this.app.get('/server/experiment/:id',api_server.experiment_id);
this.app.get('/server/experiment/:id/initialConfig',api_server.experiment_initialConfig);
this.app.post('/server/experiment/:id/start',api_server.experiment_start);
this.app.post('/server/experiment/:id/session/:experimentSessionId/:clientId/event',api_server.experiment_id_event);
this.app.post('/server/experiment/:id/session/:experimentSessionId/stop',api_server.experiment_session_stop);
this.app.get('/server/export/session/:id',api_export.session_id);
this.app.get('/server/export/sessions/list',api_export.experiment_sessions_list);

this.init = function(port,  clientFunctions, serverFunctions, exportFunctions ) {
  this.clientFunctions = clientFunctions;
  this.serverFunctions = serverFunctions;
  this.exportFunctions = exportFunctions;
  api_client.init(this.clientFunctions,this.io); 
  api_server.init(this.serverFunctions,this.io);
  api_export.init(this.exportFunctions,this.io); 
  this.server.listen(port,  '0.0.0.0', function() {
    debug("... API up");
  });
};


function discovery (req, res)  {
  debug('discovery');
  
  function doWork(){
    var output =    {
      clientId: this.state.clientId,
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

  debug('discovery_list');
  function doWork(){

    var output =    {
      clientId: this.state.clientId,
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


module.exports = this;






