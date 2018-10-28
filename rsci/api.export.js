"use strict"
const debug = require('debug')('RSCI.API.exporter')

const state = require('./state')


class api_export {
  constructor(exporter) {
    this.state = state
    this.exporter = exporter
    this.session_id = this.session_id.bind(this)
    this.experiment_sessions_list = this.experiment_sessions_list.bind(this)
  }

  async session_id(req, res) {
    debug('session_id')
    try {
      const data = await this.exporter.getExperimentSessionExportAsCsv(req.params.id)
      res.setHeader('Content-disposition', 'attachment; filename=experiment_session_'+ req.params.id +'.csv')
      res.set('Content-Type', 'text/csv')
      res.status(200).send(data)
    } catch (ex) {
      debug(ex)
      res.status(500).send('Something broke!')
    }
  }
  
  async experiment_sessions_list(req, res) {
    debug('experiment_sessions_list')
    try {
      const data = await this.exporter.getExperimentSessions()
      res.status(200).send(JSON.stringify(data))
    } catch (ex) {
      debug(ex)
      res.status(500).send('Something broke!')
    }
  }
}


module.exports = api_export






