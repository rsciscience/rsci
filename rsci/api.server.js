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

    this.experiment_session_stop = wrapper.async(this.serverFunctions.experiments.stop, (req) => {
      return [req.params.id, req.params.experimentSessionId, req.body];
    }, null);
    this.experiment_id_event = wrapper.async(this.serverFunctions.experiments.processSessionEvent
      , (req) => {
        return [req.params.experimentSessionId ,req.params.id,req.params.clientId, req.body];
      }
      , async (result) => {
        var data = await this.serverFunctions.experiments.getSessionOverview(result.experimentSessionId);
        this.io.emit('server_experimentsession_id_client_action', data);
      });
    this.experiment_initialConfig = wrapper.async(this.serverFunctions.experiments.initialConfigload, getArgs_id, null);
    this.experiment_id = wrapper.async(this.serverFunctions.experiments.getSessionOverview, getArgs_id, null);
    this.experiment_id_export = wrapper.async(this.serverFunctions.experiments.getSessionExportAsCsv, getArgs_id, null);
    this.experiment_start = wrapper.async(this.serverFunctions.experiments.start, getArgs_id_body, null);
    this.experiments_sessions = wrapper.standard((input) => { return this.state.experimentSessions });
    this.experiments_list = wrapper.standard(this.serverFunctions.experiments.list);
    this.experiments_reload = wrapper.standard(this.serverFunctions.experiments.reload);

    this.client_add = wrapper.standard(this.serverFunctions.client.add, postEvent_emitNetworkData.bind(this));
    this.updateClientID = wrapper.async(this.serverFunctions.client.updateID, getArgs_body, postEvent_emitNetworkData.bind(this));
    
    this.network_rescan = wrapper.standard(this.serverFunctions.networkRescan, postEvent_emitNetworkData.bind(this));
    this.network = wrapper.standard(this.serverFunctions.getNetworkData);
    this.register = wrapper.async(this.serverFunctions.register, getArgs_body, postEvent_emitNetworkData.bind(this));
    
    
  }  
}

module.exports = server;






