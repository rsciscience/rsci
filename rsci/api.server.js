"use strict";
const wrapper = require('./api.wrapper.js');
const debug = require('debug')('RSCI.API.server');
this.state = require('./state');

this.init = function (serverFunctions,io) {
  this.serverFunctions = serverFunctions;
  this.io = io;
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

this.experiment_start = (req, res) => {
  debug('server_experiment_start_event');

  function doWork(experimentId, input){

    var output = this.serverFunctions.startExperiment(experimentId, input);
    return  JSON.stringify(output);
  }

  var clientResponse = {}

  try{
    clientResponse = doWork.bind(this, req.params.id, req.body)();
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return;
  }

  res.send(clientResponse);
}

this.experiment_session_stop = (req, res) => {
  debug('experiment_session_stop');

  function doWork(experimentId, experimentSessionId, input){

    var output = this.serverFunctions.stopExperiment(experimentId, experimentSessionId, input);
    return  JSON.stringify(output);
  }

  var clientResponse = {}

  try{
    clientResponse = doWork.bind(this, req.params.id, req.params.experimentSessionId, req.body)();
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

this.experiments_sessions = wrapper.standard('server_experiments_sessions', (input) => { return this.state.experimentSessions });
this.experiments_list = wrapper.standard('server_experiments_list', this.serverFunctions.experimentsList);
this.experiments_reload = wrapper.standard('server_experiments_reload', this.serverFunctions.experimentsReload);
this.client_add         = wrapper.standard('server_client_add', this.serverFunctions.addClient, (resultData) => {
  var updateNetworkData = {
    server: this.state.server,
    me:this.state.me,
    discoveryList: this.state.discoveryList,
    clientList: this.state.clientList,
  };
  this.io.emit('server_network_event',updateNetworkData );
});
this.network_rescan = wrapper.standard('server_network', this.serverFunctions.networkRescan, (resultData) => {
  var updateNetworkData = {
    server: this.state.server,
    me:this.state.me,
    discoveryList: this.state.discoveryList,
    clientList: this.state.clientList,
  };
  this.io.emit('server_network_event',updateNetworkData );
});
this.network = wrapper.standard('server_network', () => {
  return {
    server: this.state.server,
    me: this.state.me,
    discoveryList: this.state.discoveryList,
    clientList: this.state.clientList,
  };
});

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
    doWork.bind(this,req.params.experimentSessionId ,req.params.id,req.params.clientId, req.body, cb)();
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return;
  }
}

function experimentInitialConfigGetArgsList(req) {
  const output = [];
  output.push(req.params.id);
  return output;
}
this.experiment_initialConfig = wrapper.async('server_experiment_initialConfig', this.serverFunctions.experiment_initialConfig, experimentInitialConfigGetArgsList, null);

module.exports = this;






