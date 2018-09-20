"use strict";
const wrapper = require('./api.wrapper.js');

class client {
  constructor(clientFunctions, io) {
      this.state = require('./state');
      this.clientFunctions = clientFunctions;
      this.io = io;
  
      this.getState = wrapper.callback(clientFunctions.getState);
      this.root = wrapper.standard(clientFunctions.updateSettings);
      this.experiment_init = wrapper.standard(clientFunctions.initExperimentSession);
      this.experiment_stop = wrapper.standard(clientFunctions.stopExperimentSession);
      this.server_register = wrapper.standard(clientFunctions.registerServer, (resultData) => {
        var updateNetworkData = {
          server: this.state.server,
          me: this.state.me,
          discoveryList: this.state.discoveryList,
          clientList: this.state.clientList,
        };
        this.io.emit('server_network_event', updateNetworkData);
    })
  }
}

module.exports = client;