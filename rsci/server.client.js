"use strict";
const debug = require('debug')('RSCI.server.client');
const state = require('./state');

class client {
    constructor() {
        this.state = state;
        this.add = this.add.bind(this);
        this.updateID = this.updateID.bind(this);
    }

    add(client) {
    debug('addClient');
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

    updateID(oldclientId,newclientId) {
    debug('updateClientName');

    for (var i = 0; i < this.state.clientList.length; i++) {
      if (this.state.clientList[i].clientId === oldclientId) {
        this.state.clientList[i].clientId = newclientId; 
        return true;
      }
    }
    return false;
  }
}
module.exports = client;
