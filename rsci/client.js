"use strict"
const debug = require('debug')('RSCI.client')
const state = require('./state')
const request = require('request-promise')
const heartbeat = require('./client.heartbeat')
const experiments = require('./client.experiments')


class client {
  constructor(db, api, request, discovery) {
    this.state = state
    this.db = db
    this.discovery = discovery
    this.heartbeat = new heartbeat(api, request.serverHeartbeatCommand)
    this.experiments = new experiments(db, api)
    // handlers
    this.registerWithServer = this.registerWithServer.bind(this)
    this.registerServer = this.registerServer.bind(this)
    this.updateSettings = this.updateSettings.bind(this)
    this.getState = this.getState.bind(this)
    this.search = this.search.bind(this)
  }

  async registerWithServer(payload, server) {
    debug('registerWithServer')
    const options = {
      uri: 'http://' + server.ip + ':' + server.port + '/server/client/add',
      json: true,
      method: 'POST',
      body: payload
    }
    try {
      await request(options)
      this.api.add_listener('heartbeat_response', this.heartbeat.ui_response)
      this.heartbeat.start()
    } catch (e) {
      debug('Error registering client:', e)
    }
  }

  async registerServer(server_payload) {
    debug('registerServer')
    this.state.server = server_payload
    this.state.clientList = []
    this.state.isServer = false

    await this.db.settings.save({ isServer: false })
    debug('Saved settings')

    const payload = { 
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
    debug('updateSettings')
    if (!payload.clientId) {
      throw ('no supplied client id')
    }
    this.state.clientId = payload.clientId
    this.state.me.clientId = this.state.clientId

    const res = await this.db.settings.save({ clientId: this.state.clientId })
    debug('Saved settings', res)

    const change = {
      oldClientId: this.state.clientId,
      newClientId: payload.clientId
    }
    if (change.newClientId != change.oldClientId) {
      updateServerOnClientIdChange(change, this.state.server) 
    }
    return { clientId: this.state.clientId }
  }

  async getState(cb) {
    debug('getState')
    const data = await this.db.experimentSessionsLocal.getList()
    console.log('database results')
    cb({
      server: this.state.server,
      me:this.state.me,
      experimentSessionsLocal: data,
      clientUIisAvailable: this.state.clientUIisAvailable,
      ts_ClientUIisAvailable: this.state.ts_ClientUIisAvailable
    }) 
  }

  async updateServerOnClientIdChange(change, server) {
    const options = {
      uri: 'http://' + server.ip + ':' + server.port + '/server/client/updateClientID',
      json: true,
      method: 'POST',
      body: change
    }
    try {
      await request(options)
    } catch (e) {
      debug('Error sending experiment session event:', e)
    }
  }

  async search() {
    debug('search')
    this.state.discoveryList = await this.discovery.search(this.state.cpuInterface)
    debug('Discovery List has ' + this.state.discoveryList.length)
    this.state.server = this.discovery.findServer(this.state.discoveryList)
    if (this.state.server && this.state.server.me == false) {
      debug('registering')
      const payload = { 
        ip: me.ip,
        port: me.port,
        clientId: me.clientId, 
        initTimeStamp: me.initTimeStamp 
      }
      this.registerWithServer(payload, this.state.server)
    }
  }
}

module.exports = client

