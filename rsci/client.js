"use strict";
const debug = require('debug')('RSCI.client');
const state = require('./state');
const api = require('./api');
const db = require('./db');
var helpers = require('./helpers');
const request = require('request-promise');
const discovery = require('./discovery');

class client {
  constructor() {
    this.state = state;
    this.initExperimentSession = this.initExperimentSession.bind(this);
    this.saveExperimentSessionEventOnClient = this.saveExperimentSessionEventOnClient.bind(this);
    this.stopExperimentSession = this.stopExperimentSession.bind(this);
    this.registerWithServer = this.registerWithServer.bind(this);
    this.registerServer = this.registerServer.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.getState = this.getState.bind(this);
    this.search = this.search.bind(this);
  }

  async initExperimentSession(experimentRequest) {
    debug('initExperimentSession');

    var requestConfig = {
      experimentId: experimentRequest.experimentId,
      experimentSessionId: experimentRequest.experimentSessionId,
      experimentConfig: experimentRequest.experimentConfig,
      sessionVariables: experimentRequest.experimentConfig.sessionVariables,
    };

    var esl = {
      experimentSessionId: requestConfig.experimentSessionId,
      experimentId: requestConfig.experimentId,
      experimentConfig: requestConfig.experimentConfig,
      clientId: this.state.clientId,
      sessionStartTime: new Date(),
      actions: []
    }
    
    await db.experimentSessionsLocal.save(esl);

    requestConfig.experimentConfig.session = eval(experimentRequest.experimentConfig.session);

    this.state.currentExperimentSession = requestConfig;

    function watchEvents(currentExperimentSession, data) {
      this.sendServerExperimentSessionEvent(data,
        this.state.server,
        this.state.clientId,
        currentExperimentSession.experimentId,
        currentExperimentSession.experimentSessionId);

      this.saveExperimentSessionEventOnClient(
        currentExperimentSession,
        this.state.clientId,
        data
      );
    }

    var sess = new requestConfig.experimentConfig.session(requestConfig.experimentSessionId, { sessionVariables: requestConfig.sessionVariables });

    sess.on('Init', watchEvents.bind(this, esl));
    sess.on('Dispose', watchEvents.bind(this, esl));
    sess.on('Start', watchEvents.bind(this, esl));
    sess.on('Stop', watchEvents.bind(this, esl));
    sess.on('Event', watchEvents.bind(this, esl));
    sess.on('Action', watchEvents.bind(this, esl));

    var comms = api.getClientCommunicationFunctions(sess.listen);

    comms.init({
      experimentId: requestConfig.experimentId,
      experimentSessionId: requestConfig.experimentSessionId,
      ui: requestConfig.experimentConfig.ui
    });

    sess.init(comms);

    this.state.currentExperimentSession.sessionHandle = sess;

    return {
      clientId: esl.clientId,
      startDate: esl.date,
      experimentId: esl.experimentId,
      experimentSessionId: esl.experimentSessionId,
    };
  }

  async saveExperimentSessionEventOnClient(currentExperimentSession, clientId, data) {
    debug('saveExperimentSessionEventOnClient');
    currentExperimentSession.actions.push(data);
    return db.experimentSessionsLocal.save(currentExperimentSession);
  }

  stopExperimentSession() {
    debug('stopExperimentSession')
    this.state.currentExperimentSession.sessionHandle.stop()
    return { experimentSessionId: this.state.currentExperimentSession.experimentSessionId }
  }

  async registerWithServer(payload, server) {
    debug('registerWithServer');
    var options = {
      uri: 'http://' + server.ip + ':' + server.port + '/server/client/add',
      json: true,
      method: 'POST',
      body: payload
    };
    try {
      let res = await request(options);
    } catch (e) {
      debug('Error registering client:', e);
    }
  }

  async registerServer(payload) {
    debug('registerServer');
    this.state.server = payload;
    this.state.clientList = [];
    this.state.isServer = false;

    await db.settings.save({ isServer: false });
    debug('Saved settings');

    var payload = { 
      ip: this.state.me.ip,
      port: this.state.me.port,
      clientId: this.state.me.clientId, 
      initTimeStamp: this.state.me.initTimeStamp,
      clientUIisAvailable : this.state.clientUIisAvailable,
      ts_ClientUIisAvailable: this.state.ts_ClientUIisAvailable,
    }
    this.registerWithServer(payload, this.state.server)
    return { success: true }
  }

  async updateSettings(payload) {
    debug('updateSettings');
    if (!payload.clientId) {
      throw ('no supplied client id');
    }
    this.state.clientId = payload.clientId;
    this.state.me.clientId = this.state.clientId;

    var res = await db.settings.save({ clientId: this.state.clientId });
    debug('Saved settings', res);

    var change = {
      oldClientId: this.state.clientId,
      newClientId: payload.clientId
    }
    if (change.newClientId != change.oldClientId) {
      updateServerOnClientIdChange(change, this.state.server) 
    }
    return { clientId: this.state.clientId }
  }

  async getState(cb) {
    debug('getState');
    var data = await db.experimentSessionsLocal.getList();
    console.log('database results');
    cb({
      server: this.state.server,
      me:this.state.me,
      experimentSessionsLocal: data,
      clientUIisAvailable: this.state.clientUIisAvailable,
      ts_ClientUIisAvailable: this.state.ts_ClientUIisAvailable
    }); 
  }

  async updateServerOnClientIdChange(change, server) {
    var options = {
      uri: 'http://' + server.ip + ':' + server.port + '/server/client/updateClientID',
      json: true,
      method: 'POST',
      body: change
    };
    try {
      let res = await request(options);
    } catch (e) {
      debug('Error sending experiment session event:', e);
    }
  }

  async sendServerExperimentSessionEvent(data, server, clientId, experimentId, experimentSessionId) {
    debug('sendServerExperimentSessionEvent');
    var options = {
      uri: 'http://' + server.ip + ':' + server.port + '/server/experiment/' + experimentId + '/session/' + experimentSessionId + '/' + clientId + '/event',
      json: true,
      method: 'POST',
      body: data
    };
    try {
      let res = await request(options);
    } catch (e) {
      debug('Error sending experiment session event:', e);
    }
  }

  async search() {
    debug('search');
    this.state.discoveryList = await discovery.search(this.state.cpuInterface, this.state.listeningPort)
    debug('Discovery List has ' + this.state.discoveryList.length);
    this.state.server = discovery.findServer(this.state.discoveryList);
    if (this.state.server && this.state.server.me == false) {
      debug('registering');
      var payload = { 
        ip: me.ip,
        port: me.port,
        clientId: me.clientId, 
        initTimeStamp: me.initTimeStamp 
      }
      this.client.registerWithServer(payload, this.state.server)
    }
  }
}

module.exports = client;

