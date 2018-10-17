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

var discovery = require('./rsci/discovery');
debug('Init Discovery');

this.client = new client();
this.server = new server();
this.db = require('./rsci/db');
this.export = require('./rsci/export');
this.state = require('./rsci/state');
this.helpers = require('./rsci/helpers')

this.startServerSearch = function (discoveryList) {
  debug('startServerSearch');
  debug('Discovery List has ' + discoveryList.length);
  this.state.discoveryList = discoveryList;
  
  this.state.server = discovery.findServer(this.state.discoveryList);
  if (this.state.server &&   this.state.server.me == false) {
    debug('registering');
    var payload = { ip: me.ip, clientId: me.clientId, initTimeStamp: me.initTimeStamp }
    this.client.registerWithServer(payload, this.state.server.ip, this.state.listeningPort);
  }
}.bind(this);

this.initSettings = async function (cb) {
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
  
  let me = {
    ip: ip.address(),
    clientId: this.state.clientId,
    initTimeStamp: this.state.initTimeStamp,
  };
  this.state.me = me;
  me.me = true;

  cb();
}.bind(this);

this.init = function () {
  debug('init')
  
  this.initSettings(()=>{
    this.state.experiments.configs = this.server.experiments.load(this.state.experiments.configDir);
    api.init(this.state.listeningPort,  this.client, this.server, this.export);

    api.startUiHeartbeat((isAvailable) => {
      if (this.state.clientUIisAvailable != isAvailable){
        debug('clientUIisAvailable ' + isAvailable);
        this.state.clientUIisAvailable = isAvailable;
      }
      this.state.ts_ClientUIisAvailable = new Date();
    });
 
    if (this.state.isServer === true) {
      debug('I\'m the server');
      this.server.register();
    } else {
      discovery.search(this.state.cpuInterface, this.state.listeningPort).then(this.startServerSearch);
    }
  });

}.bind(this);



this.init();




