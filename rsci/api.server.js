"use strict";

const debug = require('debug')('RSCI.API.server');
this.state = require('./state');

this.init = function (serverFunctions) {
  this.serverFunctions = serverFunctions;
}


this.network = (req, res) => {
  debug('server_network');
  function doWork() {
    var output = {
      server: this.state.server,
      me: this.state.me,
      discoveryList: this.state.discoveryList,
      clientList: this.state.clientList,
    };
    return JSON.stringify(output);
  };

  var clientResponse = {}

  try {
    clientResponse = doWork.bind(this)();
  } catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return;
  }

  res.send(clientResponse);
}

this.network_rescan = (req, res) => {
  debug('server_network');
  function doWork(){
    var output = this.serverFunctions.networkRescan(()=>{
      debug('server_network_rescan post emit');
      var updateNetworkData = {
        server: this.state.server,
        me:this.state.me,
        discoveryList: this.state.discoveryList,
        clientList: this.state.clientList,
      };
      this.io.emit('server_network_event',updateNetworkData );

    });
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

this.experiment_id = (req, res) => {
  debug('server_experiment_id');
  function doWork(sessionId){


    var output = this.serverFunctions.getExperimentSessionOverview(id);
    return  JSON.stringify( output);
  };

  var clientResponse = {}

  try{
    clientResponse =  doWork.bind(this)(req.params.id);
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return ;
  }

  res.send(clientResponse);
}

this.experiment_id_export = (req, res) =>  {
  debug('server_experiment_id_export');
  function doWork(sessionId){

    var output = this.serverFunctions.getExperimentSessionExportAsCsv(sessionId);
    return  JSON.stringify( output);
  };

  var clientResponse = {}

  try{
    clientResponse =  doWork.bind(this)(req.params.id);
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return ;
  }

  res.send(clientResponse);
}

this.experiments_sessions = (req, res)  => {
  debug('server_experiments_sessions');
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


this.experiments_list = (req, res) => {
  debug('server_experiments_list');

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

this.experiment_start = (req, res) => {
  debug('server_experiment_start_event');

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

this.register = (req, res) => {
  debug('server_register');

  function doWork(input){
    var output = this.serverFunctions.register(()=>{
      debug('server_register post emit');
      var updateNetworkData = {
        server: this.state.server,
        me:this.state.me,
        discoveryList: this.state.discoveryList,
        clientList: this.state.clientList,
      };
      this.io.emit('server_network_event',updateNetworkData ) ;
    });
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


this.client_add = (req, res) => {
  debug('server_client_add');

  function doWork(input){
    var output = this.serverFunctions.addClient(input);
    var updateNetworkData = {
      server: this.state.server,
      me:this.state.me,
      discoveryList: this.state.discoveryList,
      clientList: this.state.clientList,
    };
    this.io.emit('server_network_event',updateNetworkData ) ;

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



 this.client_namechange =  (req, res) => {
  debug('server_client_add');

  function doWork(input){
    var output = this.serverFunctions.updateClientName(input.oldClientId,input.newClientId);
    var updateNetworkData = {
      server: this.state.server,
      me:this.state.me,
      discoveryList: this.state.discoveryList,
      clientList: this.state.clientList,
    };
    this.io.emit('server_network_event',updateNetworkData ) ;

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


this.experiment_id_event = (req, res) => {
  //watch all client events
  debug('server_experiment_id_event');

  function doWork(sessionId, expId, clientId, input){

    var output = this.serverFunctions.processExperimentSessionEvent(sessionId,expId , clientId, input);
    this.io.emit('server_experimentsession_id_client_action',this.serverFunctions.getExperimentSessionOverview(sessionId) ) ;
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


  res.status(200).send();
}

module.exports = this;






