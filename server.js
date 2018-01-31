"use strict";
this.state = require('./state');

this.startJob = async function (jobId) {
  debug('server.startJob');

  var payload = {
    jobId: generateId()
  };

  var port = this.state.listeningPort;

  async function sendClientJobStart(client) {
    debug('sendClientJobStart');

    var options = {
      uri: 'http://' + client.ip + ':' + port + '/client/job/start',
      json: true,
      method: 'POST',
      body: payload
    };

    try {
      let res = await request(options);
      return res;

    } catch (e) {
      debug('Error sending job event');
    }
    return null;
  }

  let calledClients = await Promise.all(this.state.clientList.map(sendClientJobStart));

  return {
    clientList: calledClients,
    jobStartDate: new Date(),
    jobId: jobId
  };

};


this.addClient = function (client) {
  debug('server.addClient');

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
  debug('server.register');

  this.state.server = this.state.me;

  function gotDiscoveryList(discoveryList) {
    debug('gotDiscoveryList');

    this.state.discoveryList = discoveryList;

    let payload = {
      ip: this.state.server.ip,
      id: this.state.server.id,
      initTimeStamp: this.state.server.initTimeStamp,
    };

    this.server.sendDiscoveryListNewServer(payload);
  }
  function err(e) {
    debug('error getting discovery list', e);
  }


  discovery.search(this.state.cpuInterface, this.state.listeningPort).then(gotDiscoveryList.bind(this));


};

this.sendDiscoveryListNewServer = async function (payload) {
  debug('server.sendDiscoveryListNewServer');

  var port = this.state.listeningPort;

  async function sendListNewServer(client) {
    debug('sendClientJobStart');

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

this.loadServerData = function(){

  this.state.experiments = [
    {
          id:1,
    sessionConfig:{
      boxes:[]
    }
    }
  ]
};

module.exports =  this;



