"use strict";
const wrapper = require('./api.wrapper.js');
const debug = require('debug')('RSCI.API.client');
this.state = require('./state');

this.init = function(clientFunctions, io){
  this.clientFunctions = clientFunctions;
  this.io = io;
}

this.getState        = wrapper.callback('client_state', this.clientFunctions.getState);
this.root            = wrapper.standard('root', this.clientFunctions.updateSettings);
this.experiment_init = wrapper.standard('experiment_init_event', this.clientFunctions.initExperimentSession);
this.experiment_stop = wrapper.standard('experiment_stop', this.clientFunctions.stopExperimentSession);
this.server_register = wrapper.standard('server_register', this.clientFunctions.registerServer, (resultData) => {
  var updateNetworkData = {
    server: this.state.server,
    me:this.state.me,
    discoveryList: this.state.discoveryList,
    clientList: this.state.clientList,
  };
  this.io.emit('server_network_event',updateNetworkData);
});

// My module
function MyObject(bar) {
  this.bar = bar;
}

MyObject.prototype.foo = function foo() {
  console.log(this.bar);
};

module.exports = MyObject;

// In another module:
var MyObjectOrSomeCleverName = require("./my_object.js");
var my_obj_instance = new MyObjectOrSomeCleverName("foobar");
my_obj_instance.foo(); // => "foobar"




