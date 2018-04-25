"use strict";

const debug = require('debug')('RSCI.API.export');
this.state = require('./state');

this.init = function (exportFunctions,io) {
  this.exportFunctions = exportFunctions;
  this.io = io;
}

this.session_id = (req, res) =>  {
  debug('session_id');
  function doWork(experimentSessionId,cb){
    this.exportFunctions.getExperimentSessionExportAsCsv(experimentSessionId,cb);
  }

  function cb(data){
    res.status(200).send(data);
  }

  try{
     doWork.bind(this)(req.params.id,cb);
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return ;
  }
  res.setHeader('Content-disposition', 'attachment; filename=experiment_session_'+ req.params.id +'.csv');
  res.set('Content-Type', 'text/csv');

}

this.experiment_sessions_list = (req, res) =>  {
  debug('experiment_sessions_list');

  function doWork(cb){
    this.exportFunctions.getExperimentSessions(cb);
  }

  function cb(data){
    res.status(200).send(JSON.stringify( data));
  }

  try{
     doWork.bind(this)(cb);
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return ;
  }

}

module.exports = this;






