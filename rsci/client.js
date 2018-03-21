"use strict";
const debug = require('debug')('RSCI.client');
this.state = require('./state');
const api = require('./api');
const db = require('./db');

const request = require('request-promise');

this.initExperimentSession = function (experimentRequest) {
  debug('initExperimentSession');

  var requestConfig = {
    experimentId: experimentRequest.experimentId,
    instanceId: experimentRequest.instanceId,
    experimentConfig: experimentRequest.experimentConfig,
  };

  var esl = db.experimentSessions.save({
    experimentSessionId: requestConfig.instanceId,
    experimentId: requestConfig.experimentId,
    experimentConfig: requestConfig.experimentConfig,
    clientId: this.state.clientId,
    sessionStartTime: new Date(),
    actions: []
  });

  db.experimentSessionLocalUpdate(esl);

  requestConfig.experimentConfig.session = eval(experimentRequest.experimentConfig.session);

  this.state.currentExperimentSession = requestConfig;

  function watchEvents(currentExperimentSession, data) {
    sendServerExperimentSessionEvent(data,
      this.state.server.ip,
      this.state.listeningPort,
      this.state.clientId,
      currentExperimentSession.experimentId,
      currentExperimentSession.instanceId);

    this.saveExperimentSessionEventOnClient(
      currentExperimentSession,
      this.state.clientId,
      data
    );

  }

  var sess = new requestConfig.experimentConfig.session(requestConfig.instanceId, requestConfig.experimentConfig.config);

  sess.on('Init', watchEvents.bind(this, esl));
  sess.on('Dispose', watchEvents.bind(this, esl));
  sess.on('Start', watchEvents.bind(this, esl));
  sess.on('Stop', watchEvents.bind(this, esl));
  sess.on('Event', watchEvents.bind(this, esl));
  sess.on('Action', watchEvents.bind(this, esl));

  var comms = api.getClientCommunicationFunctions(sess.listen);

  comms.init({
    experimentId: requestConfig.experimentId,
    instanceId: requestConfig.instanceId,
    ui: requestConfig.experimentConfig.ui
  });

  sess.init(comms);

  return {
    clientId: esl.clientId,
    startDate: esl.date,
    experimentId: esl.experimentId,
    instanceId: esl.experimentSessionId,
  };
}


this.saveExperimentSessionEventOnClient = function (currentExperimentSession, clientId, data) {
  debug('saveExperimentSessionEventOnClient');

  currentExperimentSession.actions.push(data);
  db.experimentSessionLocalUpdate(esl);
}

this.registerWithServer = async function (payload, serverip, port) {
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

};

this.registerServer = function (payload) {
  debug('registerServer');
  this.state.server = payload;
  this.state.clientList = [];
  this.state.isServer = false;
  db.settings.save({ isServer: false }, function () { debug('Saved settings') });

  var payload = { ip: this.state.me.ip, clientId: this.state.me.clientId, initTimeStamp: this.state.me.initTimeStamp }
  this.registerWithServer(payload, this.state.server.ip, this.state.listeningPort);


  return { success: true };
};

this.updateSettings = function (payload) {
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

  db.settings.save({ clientId: this.state.clientId }, () => { debug('Saved settings') })

  if (change.newClientId != change.oldClientId ){
    updateServerOnClientIdChange(change,this.state.server.ip, this.state.listeningPort); 
  }

  return { clientId: this.state.clientId };
};

async function updateServerOnClientIdChange(change,serverip, port, ){
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


async function sendServerExperimentSessionEvent(data, serverip, port, clientId, experimentId, instanceId, ) {
  debug('sendServerExperimentSessionEvent');
  var options = {
    uri: 'http://' + serverip + ':' + port + '/server/experiment/' + experimentId + '/session/' + instanceId + '/' + clientId + '/event',
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


module.exports = this;

