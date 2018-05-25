"use strict";

const debug = require('debug')('RSCI.API.server');
this.state = require('./state');

this.init = function (serverFunctions,io) {
  this.serverFunctions = serverFunctions;
  this.io = io;
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
  async function doWork(sessionId, cb){
   var output  = this.serverFunctions.getExperimentSessionOverview(id);
   cb( output);
  };

  function cb(data){
    res.status(200).send(JSON.stringify(data));
  }

  try{
    doWork.bind(this)(req.params.id, cb);
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return ;
  }
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

 this.updateClientID =  (req, res) => {
  debug('server_client_add');

  function doWork(input){
    var output = this.serverFunctions.updateClientID(input.oldClientId,input.newClientId);
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

  async function doWork(sessionId, expId, clientId, input,cb ){

    await this.serverFunctions.processExperimentSessionEvent(sessionId,expId , clientId, input);
    // Send the admin page an update of the session data
    var  data = await this.serverFunctions.getExperimentSessionOverview(sessionId);
    this.io.emit('server_experimentsession_id_client_action', data);
    cb();
  }

  function cb(data){
    res.status(200).send(JSON.stringify(data));
  }

  try{
    doWork.bind(this,req.params.sessionId ,req.params.id,req.params.clientId, req.body, cb)();
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return;
  }
}

this.experiment_initialConfig = (req, res) => {
  //watch all client events
  debug('server_experiment_initialConfig');

  async function doWork(expId, cb ){

    var data = await this.serverFunctions.experiment_initialConfig(expId);
    cb(data);
  }

  function cb(data){
    res.status(200).send(JSON.stringify(data));
  }

  try{
    doWork.bind(this, req.params.id, cb)();
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return;
  }
}

module.exports = this;






