"use strict"
const debug = require('debug')('RSCI.API.server')
const wrapper = require('./api.wrapper.js')

const state = require('./state')


class server {
  constructor(api, server) {
    this.state = state
    this.api = api
    // handlers
    this._postEvent_emitSessionData = this._postEvent_emitSessionData.bind(this)
    this._postEvent_emitNetworkData = this._postEvent_emitNetworkData.bind(this)

    const getArgs_id = req => [req.params.id]
    const getArgs_body = req => [req.body]
    const getArgs_id_body = req => [req.params.id, req.body]
    const getArgs_experiment = req => [req.params.id, req.params.experimentSessionId, req.body]
    const getArgs_event = req => [req.params.experimentSessionId, req.params.id, req.params.clientId, req.body]

    this.experiment_session_stop = wrapper.async(server.experiments.stop, getArgs_experiment, null)
    this.experiment_id_event = wrapper.async(server.experiments.processSessionEvent, getArgs_event, this._postEvent_emitSessionData)
    this.experiment_initialConfig = wrapper.async(server.experiments.initialConfigload, getArgs_id, null)
    this.experiment_id = wrapper.async(server.experiments.getSessionOverview, getArgs_id, null)
    this.experiment_id_export = wrapper.async(server.experiments.getSessionExportAsCsv, getArgs_id, null)
    this.experiment_start = wrapper.async(server.experiments.start, getArgs_id_body, null)
    this.experiments_sessions = wrapper.standard(input => this.state.experimentSessions)
    this.experiments_list = wrapper.standard(server.experiments.list)
    this.experiments_reload = wrapper.standard(server.experiments.reload)

    this.client_add = wrapper.standard(server.client.add, this._postEvent_emitNetworkData)
    this.client_heartbeat = wrapper.standard(server.client.heartbeat, this._postEvent_emitNetworkData)
    this.updateClientID = wrapper.async(server.client.updateID, getArgs_body, this._postEvent_emitNetworkData)
    
    this.network_rescan = wrapper.async(server.networkRescan, getArgs_body, this._postEvent_emitNetworkData)
    this.register = wrapper.async(server.register, getArgs_body, this._postEvent_emitNetworkData)
  }

  async _postEvent_emitSessionData(result) {
    var data = await server.experiments.getSessionOverview(result.experimentSessionId)
    this.api.emit('server_experimentsession_id_client_action', data)
  }

  _postEvent_emitNetworkData(resultData) {
    this.api.emit('server_network_event', this.api.getNetworkData())
  }
}

module.exports = server






