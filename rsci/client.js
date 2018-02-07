"use strict";
const debug = require('debug')('RSCI.client');
this.state = require('./state');

this.startExperimentSession = function (experimentRequest) {
  debug('startExperimentSession');
/*
  var payload = {
    experimentId : experimentId, 
    instanceId: helpers.generateId(),
    config:JSON.stringify(expConfig),
  };
*/

var requestConfig = {
  experimentId : experimentRequest.experimentId, 
  instanceId: experimentRequest.instanceId,
  config: eval(experimentRequest.config),      

};

this.state.currentExperimentSession = requestConfig;
  
  function watchEvents(args) {
    sendServerExperimentSessionEvent(args, 
      this.state.server.ip,
       this.state.listeningPort, 
       this.state.id, 
       this.state.currentExperimentSession.experimentId,
       this.state.currentExperimentSession.instanceId);
  }
  var j = new  requestConfig.config.session( requestConfig.instanceId,  requestConfig.config );

  j.on('Start', watchEvents.bind(this));
  j.on('Stop', watchEvents.bind(this));
  j.on('Event', watchEvents.bind(this));
  j.on('Action', watchEvents.bind(this));

  j.start(webApp.getClientCommunicationFunctions(j.listen));
  return {
    clientId: this.state.id,
    startDate: new Date(),
    experimentId : experimentRequest.experimentId, 
    instanceId: experimentRequest.instanceId,
  };
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
    debug('Error registering client');
  }

};

this.registerServer = function (payload) {
  debug('registerServer');
  this.state.server = payload;
  this.state.clientList = [];

  var payload = { ip: this.state.me.ip, id: this.state.me.id, initTimeStamp: this.state.me.initTimeStamp }
  this.client.registerWithServer(payload, this.state.server.ip, this.state.listeningPort);


  return { success: true };
};


async function sendServerExperimentSessionEvent(data, serverip, port, clientId, experimentId, instanceId, ) {
  debug('sendServerExperimentSessionEvent');
  var options = {
    uri: 'http://' + serverip + ':' + port + '/server/experiment/' + experimentId + '/session/' +  instanceId + '/'+ clientId + '/event',
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


module.exports =  this;

