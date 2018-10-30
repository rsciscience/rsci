"use strict"
const debug = require('debug')('RSCI.server')
const state = require('./state')
const request = require('request-promise')
const experiments = require('./server.experiments.js')
const client = require('./server.client')

class server {
  constructor(db, discovery) {
    this.state = state
    this.db = db
    this.discovery = discovery
    this.experiments = new experiments(db)
    this.client = new client()
    // handlers
    this.register = this.register.bind(this)
    this.networkRescan = this.networkRescan.bind(this)
  }

  async register() {
    debug('register')
    this.state.clientList = []
    this.state.server = this.state.me
    this.state.isServer = true

    await this.db.settings.save({ isServer: true })
    debug('Saved settings')

    this.state.discoveryList = await this.discovery.search(this.state.cpuInterface)
    debug('gotDiscoveryList')

    const payload = {
      ip: this.state.server.ip,
      port: this.state.listeningPort,
      clientId: this.state.server.clientId,
      initTimeStamp: this.state.server.initTimeStamp,
    }
    Promise.all(this.state.discoveryList.map(c => this._sendListNewServer(c, payload)))
  }

  async _sendListNewServer(client, payload) {
    debug('sendListNewServer')
    const options = {
      uri: 'http://' + client.ip + ':' + client.port + '/client/server/register',
      json: true,
      method: 'POST',
      body: payload
    }
    try {
      return await request(options)
    } catch (e) {
      debug('Error sending server registration:', e)
    }
    return null
  }

  async networkRescan() {
    debug('networkRescan')
    this.state.discoveryList = await this.discovery.search(this.state.cpuInterface)
    debug('gotDiscoveryList')
    const filteredClientList = this.state.clientList.filter((c) => this.state.discoveryList.find((d) => d.id === c.id))
    debug('found ' + (this.state.clientList.length - filteredClientList.length) + ' missing clients')
    this.state.clientList = filteredClientList
  }
}

module.exports = server
