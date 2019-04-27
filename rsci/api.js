"use strict"
const debug = require('debug')('RSCI.API')
const express = require('express')
const http_server = require('http')
const bodyParser = require('body-parser')
const path = require('path')
const io = require('socket.io')
const api_export = require('./api.export')
const api_client = require('./api.client')
const api_server = require('./api.server')
const UI = require('./UI')

const state = require('./state')


class api {
  constructor(port) {
    this.state = state
    this.port = port
    this.listener_list = []
    // handlers
    this.getNetworkData = this.getNetworkData.bind(this)
    this._setup_socket_listeners = this._setup_socket_listeners.bind(this)
    this._discovery = this._discovery.bind(this)
    this._discovery_list = this._discovery_list.bind(this)
  }

  init(client, server, exporter) {
    debug('init')
    this._setup_app()
    this._setup_socket()
    this._setup_routes(client, server, exporter)
    this._setup_ui =  new UI(this.app);
    this.http_server.listen(this.port, '0.0.0.0', function () {
      debug("... API up")
    })
  }

  

  add_listener(eventName, listener) {
    debug('add_listener', eventName)
    this.listener_list.push({
      eventName: eventName,
      listener: listener
    })
    if (this.socket)
      this.socket.on(eventName, listener)
  }

  emit(eventName, data) {
    debug('emit', eventName)
    this.io.emit(eventName, data)
  }

  getNetworkData() {
    debug('getNetworkData')
    return {
      server: this.state.server,
      me: this.state.me,
      discoveryList: this.state.discoveryList,
      clientList: this.state.clientList
    }
  }

  _setup_app() {
    this.app = express()
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Credentials", "true")
      res.header("Access-Control-Allow-Headers", "X-Requested-With")
      res.header("Access-Control-Allow-Headers", "Content-Type")
      res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS")
      next()
    })
    this.http_server = http_server.Server(this.app)
  }

  _setup_socket() {
    this.io = io(this.http_server, { path:"/socket", transports: ['polling', 'websocket'] })
    this.io.on('connect', this._setup_socket_listeners)
  }

  _setup_socket_listeners(socket) {
    this.socket = socket
    for (let l of this.listener_list)
      this.socket.on(l.eventName, l.listener)
  }

  _setup_routes(client, server, exporter) {
    const _api_client = new api_client(this, client)
    const _api_server = new api_server(this, server)
    const _api_export = new api_export(exporter)

    this.app.get('/discovery', this._discovery)
    this.app.get('/discovery/list', this._discovery_list)

    this.app.get('/client/state', _api_client.getState)
    this.app.post('/client', _api_client.root)
    this.app.post('/client/experiment/init', _api_client.experiment_init)
    this.app.post('/client/experiment/stop', _api_client.experiment_stop)
    this.app.post('/client/server/register', _api_client.server_register)
    this.app.post('/client/server/heartbeat', _api_client.server_heartbeat)

    this.app.post('/server/register', _api_server.register)
    this.app.get('/server/network', _api_server.network)
    this.app.post('/server/network/rescan', _api_server.network_rescan)
    this.app.post('/server/client/add', _api_server.client_add)
    this.app.post('/server/client/heartbeat', _api_server.client_heartbeat)
    this.app.post('/server/client/updateClientID', _api_server.updateClientID)

    this.app.get('/server/experiments/sessions', _api_server.experiments_sessions)
    this.app.get('/server/experiments/list', _api_server.experiments_list)
    this.app.post('/server/experiments/reload', _api_server.experiments_reload)
    this.app.get('/server/experiment/:id', _api_server.experiment_id)
    this.app.get('/server/experiment/:id/initialConfig', _api_server.experiment_initialConfig)
    this.app.post('/server/experiment/:id/start', _api_server.experiment_start)
    this.app.post('/server/experiment/:id/session/:experimentSessionId/:clientId/event', _api_server.experiment_id_event)
    this.app.post('/server/experiment/:id/session/:experimentSessionId/stop', _api_server.experiment_session_stop)

    this.app.get('/server/export/session/:id', _api_export.session_id)
    this.app.get('/server/export/sessions/list', _api_export.experiment_sessions_list)
  }

  _discovery(req, res) {
    debug('discovery')
    const output = {
      clientId: this.state.clientId,
      initTimeStamp: this.state.initTimeStamp
    }
    let clientResponse = {}
    try {
      clientResponse = JSON.stringify(output)
    } catch (ex) {
      debug(ex)
      res.status(500).send('Something broke!')
      return
    }
    res.send(clientResponse)
  }

  _discovery_list(req, res) {
    debug('discovery_list')
    const output = {
      clientId: this.state.clientId,
      initTimeStamp: this.state.initTimeStamp,
      discoveryList: this.state.discoveryList
    }
    let clientResponse = {}
    try {
      clientResponse = JSON.stringify(output)
    } catch (ex) {
      debug(ex)
      res.status(500).send('Something broke!')
      return
    }
    res.send(clientResponse)
  }
}

module.exports = api






