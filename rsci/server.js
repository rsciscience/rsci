"use strict";
const debug = require('debug')('RSCI.server');
const state = require('./state');
const fs = require('fs');
const request = require('request-promise');
const discovery = require('./discovery');
const db = require('./db');
const experiments = require('./server.experiments.js');
const client = require('./server.client');

class server {
  constructor(){
    this.state = state;
    this.getNetworkData = this.getNetworkData.bind(this);
    this.register = this.register.bind(this);
    this.sendDiscoveryListNewServer = this.sendDiscoveryListNewServer.bind(this);
    this.networkRescan = this.networkRescan.bind(this);

    this.experiments = new experiments();
    this.client = new client();
  };

  getNetworkData() {
    return {
      server: this.state.server,
      me: this.state.me,
      discoveryList: this.state.discoveryList,
      clientList: this.state.clientList,
    }
  }

  async register(cb) {
    debug('register');
    this.state.clientList = [];
    this.state.server = this.state.me;
    this.state.isServer = true;

    await db.settings.save({ isServer: true });
    debug('Saved settings');

    function gotDiscoveryList(discoveryList) {
      debug('gotDiscoveryList');

      this.state.discoveryList = discoveryList;

      let payload = {
        ip: this.state.server.ip,
        clientId: this.state.server.clientId,
        initTimeStamp: this.state.server.initTimeStamp,
      };

      this.sendDiscoveryListNewServer(payload);
      if(cb){cb();}
    }
    function err(e) {
      debug('error getting discovery list', e);
    }

    discovery.search(this.state.cpuInterface, this.state.listeningPort).then(gotDiscoveryList.bind(this));
  };

  async sendDiscoveryListNewServer(payload) {
    debug('sendDiscoveryListNewServer');

    var port = this.state.listeningPort;

    async function sendListNewServer(client) {
      debug('sendListNewServer');

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
        debug(e);
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

  networkRescan() {

    debug('networkRescan');

    function gotDiscoveryList(discoveryList) {
      debug('gotDiscoveryList');

      var rmv = [];
      this.state.discoveryList = discoveryList;
      for(var i =0 ; i< this.state.clientList.length;i++){
        var client = this.state.clientList[i]; 
        var found = false;
        for(var j =0 ; j< this.state.discoveryList.length;j++){
          if (client.ip == this.state.discoveryList[j].ip){
            found = true;
            break;
          }
        }
        if (!found){
            rmv.push(i);
        }
      }
      debug('found '+ rmv.length + ' missing clients')
      for(var i = rmv.length; i > 0; i--){
        this.state.clientList.splice(rmv[i], 1);
      }
    }

    discovery.search(this.state.cpuInterface, this.state.listeningPort).then(gotDiscoveryList.bind(this));
  }
}
module.exports = server;
