"use strict"
const debug = require('debug')('RSCI.server.client')
const state = require('./state')
const request = require('request-promise')


class client {
  constructor() {
    this.state = state
    // handlers
    this.add = this.add.bind(this)
    this.heartbeat = this.heartbeat.bind(this)
    this.updateID = this.updateID.bind(this)
  }

  add(client) {
    debug('addClient', client.clientId)
    if (!this.state.clientList.find(c => c.ip === client.ip))
      this.state.clientList.push(client)
    return this.state.clientList
  }

  heartbeat(client) {
    debug('heartbeat', client.clientId, client.clientUIisAvailable)
    const c = this.state.clientList.find(cl => cl.clientId === client.clientId)
    if (c) {
      c.ts = new Date()
      c.clientUIisAvailable = client.clientUIisAvailable
      c.ts_ClientUIisAvailable = client.ts_ClientUIisAvailable
      this.heartbeat_response(c)
    }
  }

  async heartbeat_response(client) {
    debug('heartbeat_response', client.clientId)
    const options = {
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
    debug('updateClientName', oldclientId, newclientId);
    for (let i = 0; i < this.state.clientList.length; i++) {
      if (this.state.clientList[i].clientId === oldclientId) {
        this.state.clientList[i].clientId = newclientId
        return true
      }
    }
    return false
  }
}


module.exports = client
