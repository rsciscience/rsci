"use strict";
var ip = require('ip');
const debug = require('debug')('RSCI.index.');
const request = require('request-promise');

var api = require('./rsci/api');
debug('Init api server');

var discovery = require('./rsci/discovery');
debug('Init Discovery');

this.client = require('./rsci/client');
this.db = require('./rsci/db');
this.server = require('./rsci/server');
this.state = require('./rsci/state');
this.helpers = require('./rsci/helpers')

this.onUpdateState = function (data) {
  this.state = data;
  //debug('Index - State Change');
};

this.start = function (discoveryList) {
  debug('start');
  debug('Received friend list');
  debug('Discovery List has ' + discoveryList.length);
  this.state.discoveryList = discoveryList;
  let me = {
    ip: ip.address(),
    clientId: this.state.clientId,
    initTimeStamp: this.state.initTimeStamp,
  };
  this.state.me = me;
  me.me = true;
  this.state.discoveryList.push(me);


  this.state.server = discovery.findServer(this.state.discoveryList);
  debug('server', this.state.server);
  debug('server', this.state.server.ip);
  if (this.state.server.me == true) {
    debug('I\'m the server');
  } else {
    debug('I\'m the client');
    var payload = { ip: me.ip, clientId: me.clientId, initTimeStamp: me.initTimeStamp }
    this.client.registerWithServer(payload, this.state.server.ip, this.state.listeningPort);
  }

  this.state.clientList = [];

  for (var i = 0, len = this.state.discoveryList; i < len; i++) {
    var client = this.state.discoveryList[i];
    if (client.ip != this.state.server.ip) {
      this.state.clientList.push(client);
    }
  }

  api.setProps(this.state);
  this.state.experiments.configs = this.server.loadExperiments(this.state.experiments.configDir);

}.bind(this);

this.initSettings = function (cb) {
  debug('initSettings');
  this.db.settings.read((data)=>{
    debug('Read settings')
    if (data && data.clientId) {
      this.state.clientId = data.clientId;
    } else {
      this.state.clientId = 'id_' + ip.address();
      this.db.settings.save({ clientId: this.state.clientId }, function () { debug('Saved settings') });
    }
    cb();
  });
}.bind(this);

this.init = function () {
  debug('init')
  this.initSettings(()=>{
    api.init(this.state.listeningPort, this.state, this.onUpdateState, this.client, this.server)
    discovery.search(this.state.cpuInterface, this.state.listeningPort).then(this.start);
  });
}.bind(this);



this.init();



