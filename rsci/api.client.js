"use strict";

const debug = require('debug')('RSCI.API.client');
const wrapper = require('./api.wrapper.js');

class client {
  constructor(clientFunctions, io) {
    debug('constructor');
    this.state = require('./state');
    this.clientFunctions = clientFunctions;
    this.io = io;

    this.getState = wrapper.callback(clientFunctions.getState);
    this.root = wrapper.async(clientFunctions.updateSettings, req => [{} /* payload? */], null);
    this.experiment_init = wrapper.async(clientFunctions.initExperimentSession, req => [req.body], null);
    this.experiment_stop = wrapper.standard(clientFunctions.stopExperimentSession);
    this.server_register = wrapper.async(clientFunctions.registerServer, (req) => { return [req.body]; },
      function (resultData) {
        var updateNetworkData = {
          server: this.state.server,
          me: this.state.me,
          discoveryList: this.state.discoveryList,
          clientList: this.state.clientList,
        };
        this.io.emit('server_network_event', updateNetworkData);
      }.bind(this))
    this.server_heartbeat = wrapper.standard(clientFunctions.heartbeat.server_response)
  }
}

module.exports = client;