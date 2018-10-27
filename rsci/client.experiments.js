"use strict"
const debug = require('debug')('RSCI.client.experiments')
const state = require('./state')
const request = require('request-promise')


class experiments {
  constructor (db, api) {
    this.state = state
    this.db = db
    this.api = api
    this.initExperimentSession = this.initExperimentSession.bind(this)
    this.saveExperimentSessionEventOnClient = this.saveExperimentSessionEventOnClient.bind(this)
    this.stopExperimentSession = this.stopExperimentSession.bind(this)
  }

  async initExperimentSession(experimentRequest) {
    debug('initExperimentSession')

    const requestConfig = {
      experimentId: experimentRequest.experimentId,
      experimentSessionId: experimentRequest.experimentSessionId,
      experimentConfig: experimentRequest.experimentConfig,
      sessionVariables: experimentRequest.experimentConfig.sessionVariables,
    }

    const esl = {
      experimentSessionId: requestConfig.experimentSessionId,
      experimentId: requestConfig.experimentId,
      experimentConfig: requestConfig.experimentConfig,
      clientId: this.state.clientId,
      sessionStartTime: new Date(),
      actions: []
    }
    
    await this.db.experimentSessionsLocal.save(esl)

    requestConfig.experimentConfig.session = eval(experimentRequest.experimentConfig.session)

    this.state.currentExperimentSession = requestConfig

    function watchEvents(currentExperimentSession, data) {
      this.sendServerExperimentSessionEvent(
        data,
        this.state.server,
        this.state.clientId,
        currentExperimentSession.experimentId,
        currentExperimentSession.experimentSessionId)

      this.saveExperimentSessionEventOnClient(
        currentExperimentSession,
        this.state.clientId,
        data
      )
    }

    const sess = new requestConfig.experimentConfig.session(requestConfig.experimentSessionId, { sessionVariables: requestConfig.sessionVariables })

    sess.on('Init', watchEvents.bind(this, esl))
    sess.on('Dispose', watchEvents.bind(this, esl))
    sess.on('Start', watchEvents.bind(this, esl))
    sess.on('Stop', watchEvents.bind(this, esl))
    sess.on('Event', watchEvents.bind(this, esl))
    sess.on('Action', watchEvents.bind(this, esl))

    this.api.add_listener('client_experiment_onevent', sess.listen)
    const comms = {
      init: (data) => { this.api.emit('client_experiment_init', data) },
      start: (data) => { this.api.emit('client_experiment_session_start', data) },
      stop: (data) => { this.api.emit('client_experiment_session_stop', data) },
      dispose: (data) => { this.api.emit('client_experiment_dispose', data) },
      emitAction: (action) => { this.api.emit('client_experiment_action', action) },
    }

    comms.init({
      experimentId: requestConfig.experimentId,
      experimentSessionId: requestConfig.experimentSessionId,
      ui: requestConfig.experimentConfig.ui
    })

    sess.init(comms)

    this.state.currentExperimentSession.sessionHandle = sess

    return {
      clientId: esl.clientId,
      startDate: esl.date,
      experimentId: esl.experimentId,
      experimentSessionId: esl.experimentSessionId,
    }
  }

  async saveExperimentSessionEventOnClient(currentExperimentSession, clientId, data) {
    debug('saveExperimentSessionEventOnClient')
    currentExperimentSession.actions.push(data)
    return this.db.experimentSessionsLocal.save(currentExperimentSession)
  }

  stopExperimentSession() {
    debug('stopExperimentSession')
    this.state.currentExperimentSession.sessionHandle.stop()
    return { experimentSessionId: this.state.currentExperimentSession.experimentSessionId }
  }

  async sendServerExperimentSessionEvent(data, server, clientId, experimentId, experimentSessionId) {
    debug('sendServerExperimentSessionEvent')
    const options = {
      uri: 'http://' + server.ip + ':' + server.port + '/server/experiment/' + experimentId + '/session/' + experimentSessionId + '/' + clientId + '/event',
      json: true,
      method: 'POST',
      body: data
    }
    try {
      await request(options)
    } catch (e) {
      debug('Error sending experiment session event:', e)
    }
  }
}


module.exports = experiments
