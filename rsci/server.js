"use strict";
const debug = require('debug')('RSCI.server');
this.state = require('./state');
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');
const request = require('request-promise');
var discovery = require('./discovery');

this.startExperiment = async function (experimentId) {
  debug('startExperiment');

var experimentConfig = null;

  for(var i = 0 ; i < this.state.experiments.configs.length; i ++ ){
    var config = this.state.experiments.configs[i];
      if (config.config.id == experimentId  ){
        experimentConfig = config; 
      }
  }

  if(experimentConfig == null){
      throw 'Can\'t find experiment ' + experimentId ;
  }


  var payload = {
    experimentId : experimentId, 
    instanceId: helpers.generateId(),
    experimentConfig:experimentConfig,
  };
  var port = this.state.listeningPort;

  async function sendClientStart(client) {
    debug('sendClientStart');

    var options = {
      uri: 'http://' + client.ip + ':' + port + '/client/experiment/start',
      json: true,
      method: 'POST',
      body: payload
    };

    try {
      let res = await request(options);
      return res;
    } catch (e) {
      debug('Error sending experiment start event');
    }
    return null;
  }
  debug(this.state.clientList)
  let calledClients = await Promise.all(this.state.clientList.map(sendClientStart));

  return {
    clientList: calledClients,
    startDate: new Date(),
    experimentId: experimentId, 
    instanceId: payload.instanceId,
  };

};


this.addClient = function (client) {
  debug('addClient');

  var isNewClient = true;

  for (var i = 0; i < this.state.clientList.length; i++) {
    if (this.state.clientList[i].ip === client.ip) {
      isNewClient = false;
    }
  }

  if (isNewClient) {
    this.state.clientList.push(client);
  }
  return this.state.clientList;

};


this.register = function () {
  debug('register');

  this.state.server = this.state.me;

  function gotDiscoveryList(discoveryList) {
    debug('gotDiscoveryList');

    this.state.discoveryList = discoveryList;

    let payload = {
      ip: this.state.server.ip,
      id: this.state.server.id,
      initTimeStamp: this.state.server.initTimeStamp,
    };

    this.sendDiscoveryListNewServer(payload);
  }
  function err(e) {
    debug('error getting discovery list', e);
  }

  discovery.search(this.state.cpuInterface, this.state.listeningPort).then(gotDiscoveryList.bind(this));
};

this.sendDiscoveryListNewServer = async function (payload) {
  debug('sendDiscoveryListNewServer');

  var port = this.state.listeningPort;

  async function sendListNewServer(client) {
    debug('sendListNewServer');

    var options = {
      uri: 'http://' + client.ip + ':' + port + '/client/server/register',
      json: true,
      method: 'POST',
      body: payload
    }

    try {
      let res = await request(options);
      return res;

    } catch (e) {
      debug(e);
      debug('Error sending server registration');
    }
    return null;
  }

  let calledClients = await Promise.all(this.state.discoveryList.map(sendListNewServer));

  return {
    clientList: calledClients,
    server: payload
  };

};

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

 function getExperiment(dir) {
  debug('Loading from : ' + dir); 
  var exp = {
     config :  eval(fs.readFileSync( path.join(dir , "config.js") ,"utf8" )),
     session : fs.readFileSync( path.join(dir , "session.js") ,"utf8"),
     ui :  fs.readFileSync( path.join(dir , "ui.vue"),"utf8" )
  } ;
  return exp;
}

this.loadExperiments = function (configDir) {
  debug('loadExperiments');
  debug('Searching : ' + configDir);
  var configs =[];
  var dirs = getDirectories(configDir);
  debug('Found ' + dirs.length + ' experiments ' );
  for (var i = 0; i < dirs.length; i++) {
    configs.push(getExperiment(path.join(configDir, dirs[i] ))); 
  }
  
  debug('loadExperiments complete ' );
  return configs;
};

module.exports = this;



