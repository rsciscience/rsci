"use strict";
const debug = require('debug')('RSCI.client');
const state = require('./state');
const db = require('./db');
const request = require('request-promise');
const discovery = require('./discovery');
const heartbeat = require('./client.heartbeat')
const experiments = require('./client.experiments')


class client {
  constructor(api) {
    this.state = state
    this.registerWithServer = this.registerWithServer.bind(this)
    this.registerServer = this.registerServer.bind(this)
    this.updateSettings = this.updateSettings.bind(this)
    this.getState = this.getState.bind(this)
    this.search = this.search.bind(this)
    this.heartbeat = new heartbeat(api)
    this.experiments = new experiments(api)
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
      await request(options);
      this.heartbeat.start()
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
      this.registerWithServer(payload, this.state.server)
    }
  }
}

module.exports = client;

