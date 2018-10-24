"use strict";
const debug = require('debug')('RSCI.API');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const api_export = require('./api.export');
const api_client = require('./api.client');
const api_server = require('./api.server');

const state = require('./state');
const app = express();
const http_server = require('http').Server(app);
const io = require('socket.io')(http_server, { transports: ['polling', 'websocket'] });


class api {
  constructor() {
    this.state = state
    this.app = app
    this.http_server = http_server
    this.io = io
    this._setup_socket_listeners = this._setup_socket_listeners.bind(this)
    this._client_experiment_onevent = this._client_experiment_onevent.bind(this)
    this._heartbeat_response = this._heartbeat_response.bind(this)
    this._discovery = this._discovery.bind(this)
    this._discovery_list = this._discovery_list.bind(this)
  }

  init(port, clientFunctions, serverFunctions, exportFunctions) {
    debug('Init Api Server')
    this.io.on('connection', this._setup_socket_listeners);
    this.api_client = new api_client(clientFunctions, this.io);
    this.api_server = new api_server(serverFunctions, this.io);
    api_export.init(exportFunctions, this.io);
    this._setupApp()
    this._setRoutes()
    this.http_server.listen(port, '0.0.0.0', function () {
      debug("... API up")
    })
  }

  _setup_socket_listeners(socket) {
    debug('_setup_socket_listeners')
    socket.on('client_experiment_onevent', this._client_experiment_onevent);
    socket.on('heartbeat_response', this._heartbeat_response);
  }

  _client_experiment_onevent(data) {
    if (this.externalExperimentSessionListen) {
      this.externalExperimentSessionListen(data);
    } else {
      throw 'No externalExperimentSession listener';
    }
  }

  _heartbeat_response(data) {
    if (this.clientHeartbeatListener) {
      this.clientHeartbeatListener()
    } else {
      throw 'No clientHeartbeat listener'
    }
  }

  getClientCommunicationFunctions(listen) {
    debug('getClientCommunicationFunctions');
    this.externalExperimentSessionListen = listen;
    return {
      init: (data) => { this.io.emit('client_experiment_init', data) },
      start: (data) => { this.io.emit('client_experiment_session_start', data) },
      stop: (data) => { this.io.emit('client_experiment_session_stop', data) },
      dispose: (data) => { this.io.emit('client_experiment_dispose', data) },
      emitAction: (action) => { this.io.emit('client_experiment_action', action) },
    }
  }

  getHeartbeatCommunicationFunction(listen) {
    debug('getHeartbeatCommunicationFunction')
    this.clientHeartbeatListener = listen
    return () => { this.io.emit('heartbeat_check') }
  }

  _setupApp() {
    debug('_setupApp')
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    this.app.use(bodyParser.json())
    this.Objectstate = {};

    this.app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname + '/index.html'));
    });
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
      next();
    });
  }

  _setRoutes() {
    debug('_setRoutes')
    this.app.get('/discovery', this._discovery);
    this.app.get('/discovery/list', this._discovery_list);

    this.app.get('/client/state', this.api_client.getState);
    this.app.post('/client', this.api_client.root);
    this.app.post('/client/experiment/init', this.api_client.experiment_init);
    this.app.post('/client/experiment/stop', this.api_client.experiment_stop);
    this.app.post('/client/server/register', this.api_client.server_register);
    this.app.post('/client/server/heartbeat', this.api_client.server_heartbeat);

    this.app.post('/server/register', this.api_server.register);
    this.app.get('/server/network', this.api_server.network);
    this.app.post('/server/network/rescan', this.api_server.network_rescan);
    this.app.post('/server/client/add', this.api_server.client_add);
    this.app.post('/server/client/heartbeat', this.api_server.client_heartbeat);
    this.app.post('/server/client/updateClientID', this.api_server.updateClientID);

    this.app.get('/server/experiments/sessions', this.api_server.experiments_sessions);
    this.app.get('/server/experiments/list', this.api_server.experiments_list);
    this.app.post('/server/experiments/reload', this.api_server.experiments_reload);
    this.app.get('/server/experiment/:id', this.api_server.experiment_id);
    this.app.get('/server/experiment/:id/initialConfig', this.api_server.experiment_initialConfig);
    this.app.post('/server/experiment/:id/start', this.api_server.experiment_start);
    this.app.post('/server/experiment/:id/session/:experimentSessionId/:clientId/event', this.api_server.experiment_id_event);
    this.app.post('/server/experiment/:id/session/:experimentSessionId/stop', this.api_server.experiment_session_stop);

    this.app.get('/server/export/session/:id', api_export.session_id);
    this.app.get('/server/export/sessions/list', api_export.experiment_sessions_list);

  }

  _discovery(req, res) {
    debug('discovery');
    var clientResponse = {}
    var output = {
      clientId: this.state.clientId,
      initTimeStamp: this.state.initTimeStamp
    }
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
    var clientResponse = {}
    var output = {
      clientId: this.state.clientId,
      initTimeStamp: this.state.initTimeStamp,
      discoveryList: this.state.discoveryList
    }
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






