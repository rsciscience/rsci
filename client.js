"use strict";
this.state = require('./state');

this.startJob = function (jobId) {
  debug('client.startJob');
  this.state.job = {
    id: jobId
  };
  function watchJobEvents(args) {
    sendServerJobEvent(args, this.state.server.ip, this.state.listeningPort, this.state.id, this.state.job.id)
  }
  var j = new job(jobId);

  j.on('Start', watchJobEvents.bind(this));
  j.on('Stop', watchJobEvents.bind(this));
  j.on('Event', watchJobEvents.bind(this));
  j.on('Action', watchJobEvents.bind(this));

  j.start(webApp.getClientCommunicationFunctions(j.listen));
  return {
    clientId: this.state.id,
    jobStartDate: new Date(),
    jobId: jobId
  };
}

this.registerWithServer = async function (payload, serverip, port) {
  debug('client.registerWithServer');

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
  debug('client.registerServer');
  this.state.server = payload;
  this.state.clientList = [];

  var payload = { ip: this.state.me.ip, id: this.state.me.id, initTimeStamp: this.state.me.initTimeStamp }
  this.client.registerWithServer(payload, this.state.server.ip, this.state.listeningPort);


  return { success: true };
};

module.exports =  this;

