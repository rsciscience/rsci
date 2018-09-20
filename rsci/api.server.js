"use strict";
const wrapper = require('./api.wrapper.js');
const debug = require('debug')('RSCI.API.server');
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
function getArgs_id_body(req) {
  const output = [];
  output.push(req.params.id, req.body);
  return output;
}
function postEvent_emitNetworkData(resultData) {
  this.io.emit('server_network_event', this.serverFunctions.getNetworkData());
}

class server {
  constructor(serverFunctions, io) {
    this.state = state;
    this.serverFunctions = serverFunctions;
    this.io = io;
    this.experiments_sessions = wrapper.standard((input) => { return this.state.experimentSessions });
    this.experiments_list = wrapper.standard(this.serverFunctions.experimentsList);
    this.experiments_reload = wrapper.standard(this.serverFunctions.experimentsReload);
    this.client_add = wrapper.standard(this.serverFunctions.addClient, postEvent_emitNetworkData.bind(this));
    this.network_rescan = wrapper.standard(this.serverFunctions.networkRescan, postEvent_emitNetworkData.bind(this));
    this.network = wrapper.standard(this.serverFunctions.getNetworkData);
    this.experiment_initialConfig = wrapper.async(this.serverFunctions.experiment_initialConfig, getArgs_id, null);
    this.experiment_id = wrapper.async(this.serverFunctions.getExperimentSessionOverview, getArgs_id, null);
    this.experiment_id_export = wrapper.async(this.serverFunctions.getExperimentSessionExportAsCsv, getArgs_id, null);
    this.register = wrapper.async(this.serverFunctions.register, getArgs_body, postEvent_emitNetworkData.bind(this));
    this.experiment_start = wrapper.async(this.serverFunctions.startExperiment, getArgs_id_body, null);
    this.updateClientID = wrapper.async(this.serverFunctions.updateClientID, getArgs_body, postEvent_emitNetworkData.bind(this));
    this.experiment_session_stop = wrapper.async(this.serverFunctions.stopExperiment, (req) => {
      return [req.params.id, req.params.experimentSessionId, req.body];
    }, null);
    this.experiment_id_event = wrapper.async(this.serverFunctions.processExperimentSessionEvent, (req) => {
      return [req.params.experimentSessionId ,req.params.id,req.params.clientId, req.body];
    }, async (result) => {
      console.log (result)
      var data = await this.serverFunctions.getExperimentSessionOverview(sessionId);
      this.io.emit('server_experimentsession_id_client_action', data);
    });
  }  
}

module.exports = server;






