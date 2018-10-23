"use strict";
var ip = require('ip');
const debug = require('debug')('RSCI.index');
const request = require('request-promise');
const server = require('./rsci/server');
const client = require('./rsci/client');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

debug('Init:RSCI');

console.log('');
console.log('  )    ');
console.log(' (__   ');
console.log(' _  )_ ');
console.log('(_)_(_)');
console.log(' (o o) ');
console.log('==\\o/==');
console.log('');

var api = require('./rsci/api');
debug('Init Api Server');

this.client = new client();
this.server = new server();
this.db = require('./rsci/db');
this.export = require('./rsci/export');
this.state = require('./rsci/state');
this.helpers = require('./rsci/helpers')


this.initSettings = async function () {
  debug('initSettings');

  var data = await this.db.settings.read();
  debug('Read settings')
  
  if (data && data.clientId) {
    this.state.clientId = data.clientId;
  } else {
    this.state.clientId = 'id_' + ip.address();
    await this.db.settings.save({ clientId: this.state.clientId });
    debug('Saved settings');
  }
  if (data && data.isServer) {
    this.state.isServer = data.isServer;
  }
  
  this.state.me = {
    me: true,
    ip: ip.address(),
    port: this.state.listeningPort,
    clientId: this.state.clientId,
    initTimeStamp: this.state.initTimeStamp,
  };
}.bind(this);


this.init = async function () {
  debug('init')
  await this.initSettings()

  this.state.experiments.configs = this.server.experiments.load(this.state.experiments.configDir);
  api.init(this.state.listeningPort, this.client, this.server, this.export);

  if (this.state.isServer === true) {
    debug('I\'m the server')
    this.server.register()
  } else {
    this.client.search()
  }
}.bind(this)


this.init()
