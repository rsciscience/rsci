"use strict";
const wrapper = require('./api.wrapper.js');

function obj(clientFunctions, io) {
  return {
    state : require('./state'),
    clientFunctions: clientFunctions,
    io: io,

    getState:        wrapper.callback('client_state', clientFunctions.getState),
    root:            wrapper.standard('root', clientFunctions.updateSettings),
    experiment_init: wrapper.standard('experiment_init_event', clientFunctions.initExperimentSession),
    experiment_stop: wrapper.standard('experiment_stop', clientFunctions.stopExperimentSession),
    server_register: wrapper.standard('server_register', clientFunctions.registerServer, (resultData) => {
      var updateNetworkData = {
        server: this.state.server,
        me: this.state.me,
        discoveryList: this.state.discoveryList,
        clientList: this.state.clientList,
      };
      this.io.emit('server_network_event', updateNetworkData);
  })
  };
};

module.exports = obj;