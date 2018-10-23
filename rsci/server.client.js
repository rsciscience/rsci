"use strict"
const debug = require('debug')('RSCI.server.client')
const state = require('./state')
const request = require('request-promise')


class client {
  constructor() {
    this.state = state
    this.add = this.add.bind(this)
    this.heartbeat = this.heartbeat.bind(this)
    this.updateID = this.updateID.bind(this)
  }

  add(client) {
    debug('addClient')
    var isNewClient = true
    for (var i = 0; i < this.state.clientList.length; i++) {
      if (this.state.clientList[i].ip === client.ip) {
        isNewClient = false
      }
    }
    if (isNewClient) {
      this.state.clientList.push(client)
    }
    return this.state.clientList
  }

  heartbeat(client) {
    debug('heartbeat')
    var c = this.state.clientList.find(cl => cl.clientId === client.clientId)
    if (c) {
      var lastts = c.ts || new Date(1900, 1, 1)
      if ((new Date() - lastts) / 1000 > 55) {
        c.ts = new Date()
        c.clientUIisAvailable = client.clientUIisAvailable
        c.ts_ClientUIisAvailable = client.ts_ClientUIisAvailable
        this.heartbeat_response(c)
      }
    }
    debug('client:', client)
    debug('clientList:', this.state.clientList)
  }

  async heartbeat_response(client) {
    debug('heartbeat_response')
    var options = {
      uri: 'http://' + client.ip + ':' + client.port + '/client/server/heartbeat',
      json: true,
      method: 'POST',
      body: { ok: new Date() }
    }
    try {
      await request(options)
    } catch (e) {
      // do nothing, wait for next heartbeat
    }
  }

  updateID(oldclientId, newclientId) {
    debug('updateClientName');
    for (var i = 0; i < this.state.clientList.length; i++) {
      if (this.state.clientList[i].clientId === oldclientId) {
        this.state.clientList[i].clientId = newclientId
        return true
      }
    }
    return false
  }
}


module.exports = client
