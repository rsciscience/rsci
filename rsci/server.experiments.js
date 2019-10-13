"use strict";
const debug = require('debug')('RSCI.server.experiments');
const state = require('./state');
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const request = require('request-promise');
const webpackConfig = require('./webpack.conf.js');
const MemoryFS = require("memory-fs");
const webpack = require("webpack");
const moment = require('moment');
const vuetemplatecompiler = require("vue-template-compiler");

class experiments {
    constructor(db) {
        this.state = state;
        this.db = db
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.processSessionEvent = this.processSessionEvent.bind(this);
        this.getSessionOverview = this.getSessionOverview.bind(this);
        this.list = this.list.bind(this);
        this.reload = this.reload.bind(this);
        this.get = this.get.bind(this);
        this.load = this.load.bind(this);
        this.initialConfigload = this.initialConfigload.bind(this);
    }

async start (experimentId, inputConfig) {
  debug('start');
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
      return client.clientId === clientAssignment.clientId; 
    }))
    if (!c) {
      continue;
    }
    newSession.clients.push({
      clientId: clientAssignment.clientId,
      assignedRat: c.assignedRat,
      ip: clientAssignment.ip,
      port: clientAssignment.port,
      config: dispatchConfig,
      actions: []
    });
  }

  await this.db.experimentSessionsServer.save(newSession);

  var payload = {
    experimentId: experimentId,
    experimentSessionId: experimentSessionId,
    experimentConfig: dispatchConfig,
  }

  async function sendClientInit(client) {
    debug('sendClientInit');
    var options = {
      uri: 'http://' + client.ip + ':' + client.port + '/client/experiment/init',
      json: true,
      method: 'POST',
      body: payload
    };
    try {
      return await request(options);
    } catch (e) {
      debug('Error sending experiment start event:', e);
    }
    return null;
  }

  let calledClients = await Promise.all(newSession.clients.map(sendClientInit));
  return {
    clientList: calledClients,
    startDate: new Date(),
    experimentId: experimentId,
    experimentSessionId: payload.experimentSessionId
  }
}

async stop (experimentId, experimentSessionId, clientList) {
  debug('stop');

  const experimentSession = await this.db.experimentSessionsServer.read(experimentSessionId);

  // if client list is empty - stop all sessions
  const stopAll = (clientList.length === 0);

  // if clientList matches id from current session stop those 
  let clientsToStop = [];
  for (var i = 0; i < experimentSession.clients.length; i++) {
    const client = experimentSession.clients[i];
    if (stopAll || clientList.contains(client.clientId)) {
      clientsToStop.push({ clientId: client.clientId, ip: client.ip, port: client.port });
      continue;
    } 
  }

  async function sendClientStop(client) {
    debug('sendClientStop');
    var options = {
      uri: 'http://' + client.ip + ':' + client.port + '/client/experiment/stop',
      json: true,
      method: 'POST',
      body: {}
    }
    try {
      return await request(options);
    } catch (e) {
      debug('Error sending experiment start event:', e);
    }
    return null;
  }

  let calledClients = await Promise.all(clientsToStop.map(sendClientStop));
  return {
    clientList: clientsToStop,
    stopDate: new Date(),
    experimentId: experimentId,
    experimentSessionId: experimentSessionId,
  }
}

isClientActive(clientId, activeClientList) {
    for (var i = 0; i < activeClientList.length; i++) {
      if (activeClientList[i].clientId.toUpperCase() === clientId.toUpperCase()) {
        return true;
      }
    }
    return false;
  }

async processSessionEvent (experimentSessionId, experimentId, clientId, clientAction) {
  debug('processSessionEvent');
  await this.db.experimentSessionsServer.insertClientAction(experimentSessionId, clientId, clientAction);

  const es = await this.db.experimentSessionsServer.read(experimentSessionId);

  if (clientAction.actionType === 'Dispose') {

    es.clientDisposeCount =  es.clientDisposeCount + 1;

    if (es.clients.length === es.clientDisposeCount) {
      es.sessionCompleted = true;
      es.sessionCompletedTime = new Date();
    }

    await this.db.experimentSessionsServer.save(es);
  }
  return es;
}


async getSessionOverview (experimentSessionId){
    debug('getSessionOverview');
    
    var data = await this.db.experimentSessionsServer.read(experimentSessionId);

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

   list() {
    debug('list');
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

    reload() {
    debug('reload');
    var output = {};
    this.state.experiments.configs = this.load(this.state.experiments.configDir); 
    output.refreshing = true;
    return output;
  };

  async get(dir, cb) {

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

   load(configDir) {
    debug('load');
    debug('Searching : ' + configDir);
    var configs = [];
    var dirs = this.getDirectories(configDir);
    debug('Found ' + dirs.length + ' experiments ');
    for (var i = 0; i < dirs.length; i++) {
      var dir = path.resolve(path.join(configDir, dirs[i]));
      this.get(dir, function (exp) {
        configs.push(exp);
      });
    }

    debug('load complete ');
    return configs;
  };

  getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path + '/' + file).isDirectory();
    });
  }


  async initialConfigload(experimentId) {
    debug('initialConfigload');
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
          clientUIisAvailable: true,
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

module.exports = experiments;



