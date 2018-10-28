"use strict"
const debug = require('debug')('RSCI.export')


class data_export {
  constructor(db) {
    this.db = db
  }

  async getExperimentSessionExportAsCsv(id) {
    debug('getExperimentSessionExportAsCsv')
    const data = await this.db.experimentSessionsServer.getList()
    try {
      return this.processsExperimentSessionData(id, data)
    } catch (ex) {
      debug('getExperimentSessionExportAsCsv failed', ex)
    }
  }

  processsExperimentSessionData(id, data) {
    const output = []
    for (let i = 0; i < data.length; i++) {
      const experimentSession = data[i]
      if (id !== experimentSession.experimentSessionId && id !== null) continue
      console.log('found exp ' + id)

      // experimentId	experimentName	sessionId	sessionStartTime	clientConfig	clientId	clientAction	clientActionTime
      const sessionInfo = [
        this._quoteWrap(experimentSession.experimentId),
        this._quoteWrap(experimentSession.experimentSessionId),
        this._quoteWrap(experimentSession.sessionStartTime)
      ]
      const sessionInfoString = sessionInfo.join(',')

      for (var j = 0; j < experimentSession.clients.length; j++) {
        const client = experimentSession.clients[j]
        const clientInfo = [
          sessionInfoString,
          this._quoteWrap(client.clientId),
          this._quoteWrap(this._escapeDoubleQuotes(JSON.stringify(client.config.sessionVariables)))
        ]
        const clientInfoString = clientInfo.join(',')

        for (var k = 0; k < client.actions.length; k++) {
          const action = client.actions[k]
          const actionInfo = [
            clientInfoString,
            this._quoteWrap(action.actionTimeStamp),
            this._quoteWrap(action.actionType)
          ]
          output.push(actionInfo.join(','))
        }
      }
    }
    return output.join('\n')
  }

  async getExperimentSessions() {
    debug('getExperimentSessions')
    const data = await this.db.experimentSessionsServer.getList()
    return data.map(exp => ({
      experimentSessionId: exp.experimentSessionId,
      experimentId: exp.experimentId,
      sessionStartTime: exp.sessionStartTime
    }))
  }

  _quoteWrap(val) {
    return '"' + val + '"'
  }

  _escapeDoubleQuotes(str) {
    return str.replace(/\\([\s\S])|(")/g, "\\$1$2") // thanks @slevithan!
  }
}

module.exports = data_export
