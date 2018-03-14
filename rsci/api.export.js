"use strict";

const debug = require('debug')('RSCI.API.export');
this.state = require('./state');

this.init = function (exportFunctions,io) {
  this.exportFunctions = exportFunctions;
  this.io = io;
}

this.session_id = (req, res) =>  {
  debug('session_id');
  function doWork(sessionId){

    var output = this.exportFunctions.getExperimentSessionExportAsCsv(sessionId);
    return  output;

};

  var clientResponse = {}

  try{
    clientResponse =  doWork.bind(this)(req.params.id);

  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return ;
  }

  res.setHeader('Content-disposition', 'attachment; filename=experiment_session_'+ req.params.id +'.csv');
  res.set('Content-Type', 'text/csv');
  res.status(200).send(clientResponse);
}

this.experiment_sessions_list = (req, res) =>  {
  debug('experiment_sessions_list');
  function doWork(){

    var output = this.exportFunctions.getExperimentSessions();
    return  JSON.stringify( output);
};

  var clientResponse = {}

  try{
    clientResponse =  doWork.bind(this)();
  }catch (ex) {
    debug(ex);
    res.status(500).send('Something broke!')
    return ;
  }

  res.send(clientResponse);
}

module.exports = this;






