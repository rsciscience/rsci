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
    this.getNetworkData = this.getNetworkData.bind(this)
    this.register = this.register.bind(this)
    this.sendDiscoveryListNewServer = this.sendDiscoveryListNewServer.bind(this)
    this.networkRescan = this.networkRescan.bind(this)
  }

  getNetworkData() {
    return {
      server: this.state.server,
      me: this.state.me,
      discoveryList: this.state.discoveryList,
      clientList: this.state.clientList
    }
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
    this.sendDiscoveryListNewServer(payload)
  }

  async sendDiscoveryListNewServer(payload) {
    debug('sendDiscoveryListNewServer')
    const calledClients = await Promise.all(this.state.discoveryList.map(this._sendListNewServer))
    return {
      clientList: calledClients,
      server: payload
    }
  }

  async _sendListNewServer(client) {
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
