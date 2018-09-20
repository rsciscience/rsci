"use strict";
const debug = require('debug')('RSCI.client');
const state = require('./state');
const api = require('./api');
const db = require('./db');
var helpers = require('./helpers');
const request = require('request-promise');

class client {
  constructor() {
    this.state = state;
    this.initExperimentSession = initExperimentSession.bind(this);
    this.saveExperimentSessionEventOnClient = saveExperimentSessionEventOnClient.bind(this);
    this.stopExperimentSession = stopExperimentSession.bind(this);
    this.registerWithServer = registerWithServer.bind(this);
    this.registerServer = registerServer.bind(this);
    this.updateSettings = updateSettings.bind(this);
    this.getState = getState.bind(this);
  }

  initExperimentSession(experimentRequest) {
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
    
    db.experimentSessionsLocal.save(esl);

    requestConfig.experimentConfig.session = eval(experimentRequest.experimentConfig.session);

    this.state.currentExperimentSession = requestConfig;

    function watchEvents(currentExperimentSession, data) {
      sendServerExperimentSessionEvent(data,
        this.state.server.ip,
        this.state.listeningPort,
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

  saveExperimentSessionEventOnClient(currentExperimentSession, clientId, data) {
    debug('saveExperimentSessionEventOnClient');
    currentExperimentSession.actions.push(data);
    db.experimentSessionsLocal.save(currentExperimentSession);
  }

  stopExperimentSession() {
    debug('stopExperimentSession');

    this.state.currentExperimentSession.sessionHandle.stop();

    return {
      experimentSessionId: this.state.currentExperimentSession.experimentSessionId
    }
  }

  async registerWithServer(payload, serverip, port) {
    debug('registerWithServer');

    var options = {
      uri: 'http://' + serverip + ':' + port + '/server/client/add',
      json: true,
      method: 'POST',
      body: payload
    };

    try {
      let res = await request(options);
    } catch (e) {

      debug(e);
      debug('Error registering client');
    }

  }

  registerServer(payload) {
    debug('registerServer');
    this.state.server = payload;
    this.state.clientList = [];
    this.state.isServer = false;
    db.settings.save({ isServer: false }, function () { debug('Saved settings') });

    var payload = { 
      ip: this.state.me.ip,
      clientId: this.state.me.clientId, 
      initTimeStamp: this.state.me.initTimeStamp,
      clientUIisAvailable : this.state.clientUIisAvailable,
      ts_ClientUIisAvailable: this.state.ts_ClientUIisAvailable,
      }
    this.registerWithServer(payload, this.state.server.ip, this.state.listeningPort);


    return { success: true };
  }

  updateSettings(payload) {
    debug('updateSettings');
    if (!payload.clientId) {
      throw ('no supplied client id');
    }
    var change = {
      oldClientId: this.state.clientId,
      newClientId: payload.clientId
    };

    this.state.clientId = payload.clientId;
    this.state.me.clientId = this.state.clientId;

    db.settings.save({ clientId: this.state.clientId }, (res) => { debug('Saved settings',res) })

    if (change.newClientId != change.oldClientId ){
      updateServerOnClientIdChange(change,this.state.server.ip, this.state.listeningPort); 
    }

    return { clientId: this.state.clientId };
  }

  getState(cb) {
    debug('getState');
    function dbResults(cb, data) {
      console.log('database results');
      cb({
        server: this.state.server,
        me:this.state.me,
        experimentSessionsLocal: data,
        clientUIisAvailable: this.state.clientUIisAvailable,
        ts_ClientUIisAvailable: this.state.ts_ClientUIisAvailable
      }); 

    }
    return db.experimentSessionsLocal.getList(dbResults.bind(this, cb));
  }

  async updateServerOnClientIdChange(change,serverip, port, ){
    var options = {
      uri: 'http://' + serverip + ':' + port + '/server/client/updateClientID',
      json: true,
      method: 'POST',
      body: change
    };

    try {
      let res = await request(options);
    } catch (e) {
      debug('Error sending experiment session event');
    }

  }

  async sendServerExperimentSessionEvent(data, serverip, port, clientId, experimentId, experimentSessionId) {
    debug('sendServerExperimentSessionEvent');
    var options = {
      uri: 'http://' + serverip + ':' + port + '/server/experiment/' + experimentId + '/session/' + experimentSessionId + '/' + clientId + '/event',
      json: true,
      method: 'POST',
      body: data
    };

    try {
      let res = await request(options);
    } catch (e) {
      debug('Error sending experiment session event');
    }

  }
}

module.exports = client;

