"use strict"
const debug = require('debug')('RSCI.API.client')
const wrapper = require('./api.wrapper.js')

const state = require('./state')


class client {
  constructor(api, client) {
    this.state = state
    this.api = api
    // handlers
    this._postEvent_emitNetworkData = this._postEvent_emitNetworkData.bind(this)

    this.getState = wrapper.callback(client.getState)
    this.root = wrapper.async(client.updateSettings, req => req.body, null)

    this.experiment_init = wrapper.async(client.experiments.initExperimentSession, req => [req.body], null)
    this.experiment_stop = wrapper.standard(client.experiments.stopExperimentSession)

    this.server_register = wrapper.async(client.registerServer, req => [req.body], this._postEvent_emitNetworkData)
    this.server_heartbeat = wrapper.standard(client.heartbeat.server_response)
  }

  _postEvent_emitNetworkData(resultData) {
    this.api.emit('server_network_event', this.api.getNetworkData());
  }
}

module.exports = client