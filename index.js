"use strict";
var ip = require('ip');
const debug = require('debug')('RSCI.index.');


var webApp = require('./webApp');
debug('Init Web server');

var discovery = require('./discovery');
debug('Init Discovery');

const request = require('request-promise');

var job = require('./job');
this.client = require('./client');
this.server = require('./server');

this.state = require('./state');
this.state.id = generateId();


function generateId() {
  return leftPadWithZeros(Math.floor(Math.random() * 1000000000));
};

function leftPadWithZeros(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }

  return str;
};


async function sendServerJobEvent(data, serverip, port, clientId, jobId) {
  debug('sendServerJobEvent');
  var options = {
    uri: 'http://' + serverip + ':' + port + '/server/job/' + jobId + '/' + clientId + '/event',
    json: true,
    method: 'POST',
    body: data
  };

  try {
    let res = await request(options);
  } catch (e) {
    debug('Error sending job event');
  }

}



this.onUpdateState = function (data) {
  this.state = data;
  //debug('Index - State Change');
};


function dumpJobs(jobs) {
  debug('FriendlyJobStatusDump');
  debug("Job Count:" + jobs.length);

  for (var i = 0, len = jobs.length; i < len; i++) {
    var job = this.state.jobs[i];
    debug("Job:" + job.id);
    debug(job.clients.length);

    for (var j = 0, lenj = job.clients.length; j < lenj; j++) {

      var client = job.clients[j];
      debug('  Client:' + client.id);
      debug(client.actions.length);

      for (var k = 0, lenk = client.actions.length - 1; k < lenk; k++) {
        var action = client.actions[k]
        debug('    ' + action.eventType);

      }

    }

  }

}



this.start =  function (discoveryList) {

  debug('start');
  debug('Received friend list');
  debug('Discovery List has ' + discoveryList.length);
  this.state.discoveryList = discoveryList;
  let me = {
    ip: ip.address(),
    id: this.state.id,
    initTimeStamp: this.state.initTimeStamp,
  };
  this.state.me = me;
  me.me = true;
  this.state.discoveryList.push(me);

  webApp.setProps(this.state);

  this.state.server = discovery.findServer(this.state.discoveryList);
  debug('server', this.state.server);
  debug('server', this.state.server.ip);
  if (this.state.server.me == true) {
    debug('I\'m the server');
    this.server.loadServerData();
  } else {
    debug('I\'m the client');
    var payload = { ip: me.ip, id: me.id, initTimeStamp: me.initTimeStamp }
    this.client.registerWithServer(payload, this.state.server.ip, this.state.listeningPort);
  }

  this.state.clientList = [];

  for (var i = 0, len = this.state.discoveryList; i < len; i++) {
    var client = this.state.discoveryList[i];
    if (client.ip != this.state.server.ip) {
      this.state.clientList.push(client);
    }
  }


}.bind(this);


this.init =  function () {
  debug('init');
    discovery.search(this.state.cpuInterface, this.state.listeningPort).then(this.start);
    webApp.init(this.state.listeningPort, this.state, this.onUpdateState, this.client, this.server)
}.bind(this);



this.init();



