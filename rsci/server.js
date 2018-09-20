"use strict";
const debug = require('debug')('RSCI.server');
const state = require('./state');
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const request = require('request-promise');
const discovery = require('./discovery');
const webpackConfig = require('./webpack.conf.js');
const MemoryFS = require("memory-fs");
const webpack = require("webpack");
const db = require('./db');
const moment = require('moment');
const vuetemplatecompiler = require("vue-template-compiler");

//vue parser

class server {
  constructor(){
    this.state = state;
    this.getNetworkData = this.getNetworkData.bind(this);
    this.startExperiment = this.startExperiment.bind(this);
    this.stopExperiment = this.stopExperiment.bind(this);
    this.processExperimentSessionEvent = this.processExperimentSessionEvent.bind(this);
    this.getExperimentSessionOverview = this.getExperimentSessionOverview.bind(this);
    this.addClient = this.addClient.bind(this);
    this.updateClientID = this.updateClientID.bind(this);
    this.isClientActive = this.isClientActive.bind(this);
    this.experimentsList = this.experimentsList.bind(this);
    this.experimentsReload = this.experimentsReload.bind(this);
    this.register = this.register.bind(this);
    this.sendDiscoveryListNewServer = this.sendDiscoveryListNewServer.bind(this);
    this.getDirectories = this.getDirectories.bind(this);
    this.getExperiment = this.getExperiment.bind(this);
    this.loadExperiments = this.loadExperiments.bind(this);
    this.networkRescan = this.networkRescan.bind(this);
    this.experiment_initialConfig = this.experiment_initialConfig.bind(this);
  };

  getNetworkData() {
    return {
      server: this.state.server,
      me: this.state.me,
      discoveryList: this.state.discoveryList,
      clientList: this.state.clientList,
    }
  }

async startExperiment (experimentId, inputConfig) {
  debug('startExperiment');
  var experimentSessionId = inputConfig.sessionVariables.experimentSessionId;

  let newSession = {
    experimentSessionId: experimentSessionId,
    experimentId: experimentId,
    sessionStartTime: new Date(),
    clients: [],
    sessionCompleted: false
  }

  var experimentConfig = null;
  for (var i = 0; i < this.state.experiments.configs.length; i++) {
    var config = this.state.experiments.configs[i];
    if (config.config.id.toUpperCase() == experimentId.toUpperCase()) {
      experimentConfig = config;
    }
  }

  if (experimentConfig == null) {
    throw 'Can\'t find experiment ' + experimentId;
  }

  if (!this.state.clientList || this.state.clientList.length < 1) {
    throw 'No clients';
  }


  //copy incoming config
  const dispatchConfig = Object.assign(experimentConfig, inputConfig);
  dispatchConfig.clientAssignments = null;
  dispatchConfig.clients = null;

  
  for (var i = 0; i < this.state.clientList.length; i++) {
    let clientAssignment = this.state.clientList[i];

    var c = inputConfig.clients.find(((client) => { 
      return client.clientId === clientAssignment.clientId; }))

    if (!c) {
      continue;
    }

    newSession.clients.push({
      clientId: clientAssignment.clientId,
      assignedRat: c.assignedRat,
      ip: clientAssignment.ip,
      config: dispatchConfig,
      actions: []
    });
  }


  await db.experimentSessionsServer.save(newSession);


  var port = this.state.listeningPort;
  var payload = {
    experimentId: experimentId,
    experimentSessionId: experimentSessionId,
    experimentConfig: dispatchConfig,
  }

  async function sendClientInit(client) {
    debug('sendClientInit');

    var options = {
      uri: 'http://' + client.ip + ':' + port + '/client/experiment/init',
      json: true,
      method: 'POST',
      body: payload
    };

    try {
      let res = await request(options);
      return res;
    } catch (e) {
      console.log(e)
      debug('Error sending experiment start event');
    }
    return null;
  }

  let calledClients = await Promise.all(newSession.clients.map(sendClientInit));

  return {
    clientList: calledClients,
    startDate: new Date(),
    experimentId: experimentId,
    experimentSessionId: payload.experimentSessionId,
  };

};


async stopExperiment (experimentId, experimentSessionId, clientList) {
  debug('stopExperiment');

  let clientsToStop = [];

  const experimentSession = await db.experimentSessionsServer.read(experimentSessionId);


  // if client list is empty - stop all sessions
  const stopAll = (clientList.length === 0);

  // if clientList matches id from current session stop those 
  for (var i = 0; i < experimentSession.clients.length; i++) {
    const client = experimentSession.clients[i];

    if (stopAll || clientList.contains(client.clientId)) {
      // stop
      clientsToStop.push({ clientId: client.clientId, ip: client.ip });
      continue;
    } 
  }
  var port = this.state.listeningPort;
  
  async function sendClientStop(client) {
    debug('sendClientStop');

    var options = {
      uri: 'http://' + client.ip + ':' + port + '/client/experiment/stop',
      json: true,
      method: 'POST',
      body: {}
    };

    try {
      let res = await request(options);
      return res;
    } catch (e) {
      console.log(e)
      debug('Error sending experiment start event');
    }
    return null;
  }

  let calledClients = await Promise.all(clientsToStop.map(sendClientStop));

  return {
    clientList: clientsToStop,
    stopDate: new Date(),
    experimentId: experimentId,
    experimentSessionId: experimentSessionId,
  };

};

async processExperimentSessionEvent (experimentSessionId, experimentId, clientId, clientAction) {
  debug('processExperimentSessionEvent');
  await db.experimentSessionsServer.insertClientAction(experimentSessionId, clientId, clientAction);

  const es = await db.experimentSessionsServer.read(experimentSessionId);

  if (clientAction.actionType === 'Dispose') {

    es.clientDisposeCount =  es.clientDisposeCount + 1;

    if (es.clients.length === es.clientDisposeCount) {
      es.sessionCompleted = true;
      es.sessionCompletedTime = new Date();
    }

    await db.experimentSessionsServer.save(es);
  }
  
}


  async getExperimentSessionOverview (experimentSessionId){
    debug('getExperimentSessionOverview');
    
    var data = await db.experimentSessionsServer.read(experimentSessionId);

      var output = {};
      output.running = true;
      output.experimentSessionId = data.experimentSessionId;
      output.clients = [];
      output.experimentId = data.experimentId;
      output.sessionCompleted = data.sessionCompleted;
      output.sessionCompletedTime = data.sessionCompletedTime;
      
      for (var j = 0; j < data.clients.length; j++) {
        var client = data.clients[j];

        var clientOverview =  {
          isOnline:true,
          clientUIisAvailable:client.clientUIisAvailable,
          assignedRat:client.assignedRat,
          clientId:client.clientId,
          sessionVariables:client.sessionVariables,
          lastActionType: null,
          lastActionTimeStamp: null,
          secondsSinceAction: null,
        };
        var action = client.actions[client.actions.length -1];
        if (action != null) {
          var duration = moment().diff(moment(action.actionTimeStamp),'seconds');
          clientOverview.lastActionType = action.actionType;
          clientOverview.lastActionTimeStamp = action.actionTimeStamp;
          clientOverview.secondsSinceAction = duration;
        }
        output.clients.push(clientOverview);
      }
      return output;

  };


  addClient(client) {
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

  updateClientID(oldclientId,newclientId) {
    debug('updateClientName');

    for (var i = 0; i < this.state.clientList.length; i++) {
      if (this.state.clientList[i].clientId === oldclientId) {
        this.state.clientList[i].clientId = newclientId; 
        return true;
      }
    }
    return false;
  }

  isClientActive(clientId, activeClientList) {
    for (var i = 0; i < activeClientList.length; i++) {
      if (activeClientList[i].clientId.toUpperCase() === clientId.toUpperCase()) {
        return true;
      }
    }
    return false;
  }

  experimentsList() {
    debug('experimentsList');
    var output = [];

    for (var i = 0; i < this.state.experiments.configs.length; i++) {
      var config = JSON.parse(JSON.stringify( this.state.experiments.configs[i].config));
      for (var j = 0; j < config.clientAssignments.length; j++) {
        var ca = config.clientAssignments[j];
        ca.active = this.isClientActive(ca.clientId, this.state.clientList);
      }
      config.sessionVariables.experimentSessionId = helpers.generateId();
      output.push(config); 
    }

    return output;
  };

  experimentsReload() {
    debug('experimentsReload');
    var output = {};
    this.state.experiments.configs = this.loadExperiments(this.state.experiments.configDir); 
    output.refreshing = true;
    return output;
  };

  register(cb) {
    debug('register');
    this.state.clientList = [];
    this.state.server = this.state.me;
    this.state.isServer = true;

    db.settings.save({ isServer: true }, function () { debug('Saved settings') });

    function gotDiscoveryList(discoveryList) {
      debug('gotDiscoveryList');

      this.state.discoveryList = discoveryList;

      let payload = {
        ip: this.state.server.ip,
        clientId: this.state.server.clientId,
        initTimeStamp: this.state.server.initTimeStamp,
      };

      this.sendDiscoveryListNewServer(payload);
      if(cb){cb();}
    }
    function err(e) {
      debug('error getting discovery list', e);
    }

    discovery.search(this.state.cpuInterface, this.state.listeningPort).then(gotDiscoveryList.bind(this));
  };

  async sendDiscoveryListNewServer(payload) {
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

  getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path + '/' + file).isDirectory();
    });
  }

  async getExperiment(dir, cb) {

    debug('Loading from : ' + dir);
    try {

      debug('Parsing out.....');
      var uistr = fs.readFileSync(path.join(dir, "ui.vue"), "utf8");
      var uiparsed = vuetemplatecompiler.parseComponent(uistr, { pad: true });

      var scripttTransformed = require("babel-core").transform(uiparsed.script.content, {
        minified: false,
        comments: false,
        babelrc: false,
        plugins: ['transform-runtime'],
        presets: ['es2015', 'stage-2'],
      });


      debug('Webpacking.....');


      webpackConfig.context = dir;
      const mfs = new MemoryFS();
      const compiler = webpack(webpackConfig);
      compiler.outputFileSystem = mfs;
      var content = '';
      await compiler.run((err, stats) => {
        debug("complier result");
        content = mfs.readFileSync("//packed.js", "utf8");
        debug('Script len : ' + content.length);
        var ui = {
          template: uiparsed.template.content,
          script: content,
          styles: uiparsed.styles[0].content
        };
        var exp = {
          config: eval(fs.readFileSync(path.join(dir, "config.js"), "utf8")),
          session: fs.readFileSync(path.join(dir, "session.js"), "utf8"),
          ui: ui
        };
        cb(exp);


      });


    } catch (err) {
      console.log(err);
    }

  }

  loadExperiments(configDir) {
    debug('loadExperiments');
    debug('Searching : ' + configDir);
    var configs = [];
    var dirs = this.getDirectories(configDir);
    debug('Found ' + dirs.length + ' experiments ');
    for (var i = 0; i < dirs.length; i++) {
      var dir = path.resolve(path.join(configDir, dirs[i]));
      this.getExperiment(dir, function (exp) {
        configs.push(exp);
      });
    }

    debug('loadExperiments complete ');
    return configs;
  };




  networkRescan(cb) {

    debug('networkRescan');

    function gotDiscoveryList(discoveryList) {
      debug('gotDiscoveryList');

      var rmv = [];
      this.state.discoveryList = discoveryList;
      for(var i =0 ; i< this.state.clientList.length;i++){
        var client = this.state.clientList[i]; 
        var found = false;
        for(var j =0 ; j< this.state.discoveryList.length;j++){
          if (client.ip == this.state.discoveryList[j].ip){
            found = true;
            break;
          }
        }
        if (!found){
            rmv.push(i);
        }
      }
      debug('found '+ rmv.length + ' missing clients')
      for(var i = rmv.length; i > 0; i--){
        this.state.clientList.splice(rmv[i], 1);
      }
      cb();
    }
    function err(e) {
      debug('error getting discovery list', e);
    }

    discovery.search(this.state.cpuInterface, this.state.listeningPort).then(gotDiscoveryList.bind(this));
  }


  async experiment_initialConfig(experimentId) {
    debug('experiment_initialConfig');

    var output = [];
    var experimentConfig = null;

    for (var i = 0; i < this.state.experiments.configs.length; i++) {
      var config = this.state.experiments.configs[i];
      if (config.config.id.toUpperCase() == experimentId.toUpperCase()) {
        experimentConfig = config;
        break;
      }
    }
    // helpers.printObjetStructure(experimentConfig)
    for (var i = 0; i < experimentConfig.config.clientAssignments.length; i++) {

      var ca = experimentConfig.config.clientAssignments[i];

      var clientsExperiment = {
        isOnline: false,
        clientUIisAvailable: ca.clientUIisAvailable,
        clientId: ca.clientId,
        assignedRat: ca.assignedRat,
        isConfigClientAssignment: true,
        isRatAssigned: true,
        isIncludedInSession: true
      }
      output.push(clientsExperiment);
    }

    for (var i = 0; i < this.state.clientList.length; i++) {
      var c = this.state.clientList[i];
      var found = false;

      for (var j = 0; j < output.length; j++) {
        var oc = output[j];
        if (c.clientId === oc.clientId) {
          oc.isOnline = true;
          oc.clientUIisAvailable=c.clientUIisAvailable;
          var found = true;
        }
      }

      if (found === false) {
        output.push({
          isOnline: true,
          clientUIisAvailable: ca.clientUIisAvailable,
          clientId: c.clientId,
          isConfigClientAssignment: false,
          assignedRat: c.assignedRat,
          isRatAssigned: false,
          isIncludedInSession: false
        })
      }

    }
    return output;
  };
}
module.exports = server;



