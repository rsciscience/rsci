"use strict"
const debug = require('debug')('RSCI.client.heartbeat')
const state = require('./state')
const request = require('request-promise')


class heartbeat {
  constructor(api) {
    this.state = state
    this.api = api
    this.ui_response = this.ui_response.bind(this)
    this.server_response = this.server_response.bind(this)
  }

  start() {
    debug('start')
    this.ui = { ts: new Date(1900, 1, 1), response: false }
    this.server = { ts: new Date(1900, 1, 1), response: false }
    this.api.add_listener('heartbeat_response', this.ui_response)
    this.intervalHandle = setInterval(this._beat.bind(this), this.state.heartbeat_interval)
    this._beat()
  }

  _update() {
    // client
    this.ui.response = new Date() - this.ui.ts <= this.state.heartbeat_interval
    if (this.state.clientUIisAvailable != this.ui.response) {
        debug('clientUIisAvailable ', this.ui.response)
        this.state.clientUIisAvailable = this.ui.response
    }
    this.state.ts_ClientUIisAvailable = new Date()
    // server
    this.server.response = new Date() - this.server.ts <= this.state.heartbeat_interval
    if (this.state.serverisAvailable != this.server.response) {
        debug('serverisAvailable ', this.server.response)
        this.state.serverisAvailable = this.server.response
    }
    this.state.ts_serverisAvailable = new Date()
  }

  _beat() {
    this._update()
    this._ui_beat()
    setTimeout(this._server_beat.bind(this), 1000)
  }

  async _ui_beat() {
    debug('ui_beat')
    this.api.emit('heartbeat_check')
  }

  ui_response() {
    debug('ui_response')
    this.ui.ts = new Date()
    this._update()
  }

  async _server_beat() {
    debug('server_beat')
    const options = {
      uri: 'http://' + this.state.server.ip + ':' + this.state.server.port + '/server/client/heartbeat',
      json: true,
      method: 'POST',
      body: {
          clientId: this.state.me.clientId,
          clientUIisAvailable: this.state.clientUIisAvailable,
          ts_ClientUIisAvailable: this.state.ts_ClientUIisAvailable,
      }
    }
    try {
      await request(options)
    } catch (e) {
      // do nothing, we'll try again later
    }
  }

  server_response(payload) {
    debug('server_response')
    this.server.ts = new Date()
    this._update()
    debug('server', payload)
  }
}


module.exports = heartbeat

