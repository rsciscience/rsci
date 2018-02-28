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

  this.state.experimentSessionsLocal.push({
    id:requestConfig.instanceId,
    experimentId: requestConfig.experimentId,
    experimentConfig: requestConfig.experimentConfig, 
    clients:[]
  });

  requestConfig.experimentConfig.session = eval(experimentRequest.experimentConfig.session);

  this.state.currentExperimentSession = requestConfig;

  function watchEvents(data) {
    sendServerExperimentSessionEvent(data,
      this.state.server.ip,
      this.state.listeningPort,
      this.state.clientId,
      this.state.currentExperimentSession.experimentId,
      this.state.currentExperimentSession.instanceId);

      this.saveExperimentSessionEventOnClient(
        this.state.currentExperimentSession.instanceId,
        this.state.clientId,
        data
      );

  }

  var sess = new requestConfig.experimentConfig.session(requestConfig.instanceId, requestConfig.experimentConfig.config);

  sess.on('Init', watchEvents.bind(this));
  sess.on('Dispose', watchEvents.bind(this));
  sess.on('Start', watchEvents.bind(this));
  sess.on('Stop', watchEvents.bind(this));
  sess.on('Event', watchEvents.bind(this));
  sess.on('Action', watchEvents.bind(this));

  var comms = api.getClientCommunicationFunctions(sess.listen);

  comms.init({
    experimentId: requestConfig.experimentId,
    instanceId: requestConfig.instanceId,
    ui: requestConfig.experimentConfig.ui
  });

  sess.init(comms);

  return {
    clientId: this.state.clientId,
    startDate: new Date(),
    experimentId: experimentRequest.experimentId,
    instanceId: experimentRequest.instanceId,
  };
}


this.saveExperimentSessionEventOnClient = function (id,clientId,data){
  debug('saveExperimentSessionEventOnClient');

  var session = {
    id: id,
    clients:[]
  }
  var known = false;
  for (var i = 0, len = this.state.experimentSessionsLocal.length; i < len; i++) {
    
    if(id == this.state.experimentSessionsLocal[i].id){
      session = this.state.experimentSessionsLocal[i];
      known = true;
      break;
    }
  }

  if(!known){
    this.state.experimentSessionsLocal.push(session);
  }

  var clients = session.clients;

  var client = {clientId:clientId,actions:[]}
  var knownClient = false;
  for (var i = 0, len = session.clients.length; i < len; i++) {
      var existingClient = session.clients[i]
      console.log(existingClient)
      if(clientId == existingClient.clientId){
        client = existingClient;
        knownClient = true;
        break;
    }
  }
  console.log(knownClient)
  if(!knownClient){
    clients.push(client);
  }
  var actions = client.actions;
  actions.push(data);
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
  if (!payload.clientId){
    throw('no supplied client id');
  }
  this.state.clientId = payload.clientId;
  this.state.me.clientId = this.state.clientId; 
  db.settings.save({clientId: this.state.clientId },()=>{debug('Saved settings')})

  return { clientId: this.state.clientId };
};



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

