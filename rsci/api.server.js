"use strict"
const debug = require('debug')('RSCI.API.server')
const wrapper = require('./api.wrapper.js')

const state = require('./state')


class server {
  constructor(api, server) {
    this.state = state
    this.api = api
    this.server = server
    this._postEvent_emitNetworkData = this._postEvent_emitNetworkData.bind(this)

    this.experiment_session_stop = wrapper.async(server.experiments.stop, (req) => {
        return [req.params.id, req.params.experimentSessionId, req.body]
      }, null)
    this.experiment_id_event = wrapper.async(server.experiments.processSessionEvent, (req) => {
        return [req.params.experimentSessionId ,req.params.id,req.params.clientId, req.body]
      }
      , async (result) => {
        var data = await server.experiments.getSessionOverview(result.experimentSessionId)
        this.api.emit('server_experimentsession_id_client_action', data)
      })
    this.experiment_initialConfig = wrapper.async(server.experiments.initialConfigload, this._getArgs_id, null)
    this.experiment_id = wrapper.async(server.experiments.getSessionOverview, this._getArgs_id, null)
    this.experiment_id_export = wrapper.async(server.experiments.getSessionExportAsCsv, this._getArgs_id, null)
    this.experiment_start = wrapper.async(server.experiments.start, this._getArgs_id_body, null)
    this.experiments_sessions = wrapper.standard((input) => { return this.state.experimentSessions })
    this.experiments_list = wrapper.standard(server.experiments.list)
    this.experiments_reload = wrapper.standard(server.experiments.reload)

    this.client_add = wrapper.standard(server.client.add, this._postEvent_emitNetworkData)
    this.client_heartbeat = wrapper.standard(server.client.heartbeat, this._postEvent_emitNetworkData)
    this.updateClientID = wrapper.async(server.client.updateID, this._getArgs_body, this._postEvent_emitNetworkData)
    
    this.network_rescan = wrapper.async(server.networkRescan, this._getArgs_body, this._postEvent_emitNetworkData)
    this.network = wrapper.standard(server.getNetworkData)
    this.register = wrapper.async(server.register, this._getArgs_body, this._postEvent_emitNetworkData)
  }  

  _getArgs_id(req) {
    const output = []
    output.push(req.params.id)
    return output
  }

  _getArgs_body(req) {
    const output = []
    output.push(req.body)
    return output
  }

  _getArgs_id_body(req) {
    const output = []
    output.push(req.params.id, req.body)
    return output
  }

  _postEvent_emitNetworkData(resultData) {
    this.api.emit('server_network_event', this.server.getNetworkData())
  }
}

module.exports = server






