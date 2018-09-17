"use strict";
const wrapper = require('./api.wrapper.js');
const debug = require('debug')('RSCI.API.server');


function init(serverFunctions, io) {
  var state = require('./state');

  function getArgs_id(req) {
    const output = [];
    output.push(req.params.id);
    return output;
  }
  function getArgs_body(req) {
    const output = [];
    output.push(req.body);
    return output;
  }

 
  return {
    state: state,
    experiments_sessions: wrapper.standard('server_experiments_sessions', function (input) { return this.state.experimentSessions }).bind({state:state}),
    experiments_list: wrapper.standard('server_experiments_list', this.serverFunctions.experimentsList),
    experiments_reload: wrapper.standard('server_experiments_reload', this.serverFunctions.experimentsReload),
    client_add: wrapper.standard('server_client_add', this.serverFunctions.addClient, (resultData) => {
      var updateNetworkData = {
        server: this.state.server,
        me: this.state.me,
        discoveryList: this.state.discoveryList,
        clientList: this.state.clientList,
      };
      this.io.emit('server_network_event', updateNetworkData);
    }),
    network_rescan: wrapper.standard('server_network', this.serverFunctions.networkRescan, (resultData) => {
      var updateNetworkData = {
        server: this.state.server,
        me: this.state.me,
        discoveryList: this.state.discoveryList,
        clientList: this.state.clientList,
      };
      this.io.emit('server_network_event', updateNetworkData);
    }),

    network: wrapper.standard('server_network', () => {
      return {
        server: this.state.server,
        me: this.state.me,
        discoveryList: this.state.discoveryList,
        clientList: this.state.clientList,
      };
    }),

     experiment_initialConfig : wrapper.async('server_experiment_initialConfig', this.serverFunctions.experiment_initialConfig, getArgs_id, null),
     experiment_id : wrapper.async('experiment_id', this.serverFunctions.getExperimentSessionOverview, getArgs_id, null),
     experiment_id_export : wrapper.async('experiment_id_export', this.serverFunctions.getExperimentSessionExportAsCsv, getArgs_id, null),
     register : wrapper.async('server_register', this.serverFunctions.register, getArgs_body, ()=>{
      var updateNetworkData = {
        server: this.state.server,
        me:this.state.me,
        discoveryList: this.state.discoveryList,
        clientList: this.state.clientList,
      };
      this.io.emit('server_network_event',updateNetworkData ) ;
    }),
   


  


experiment_start : (req, res) => {
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
},

experiment_session_stop : (req, res) => {
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
},



 updateClientID : (req, res) => {
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
},

experiment_id_event :(req, res) => {
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
},



  };




 



}

module.exports = init;






