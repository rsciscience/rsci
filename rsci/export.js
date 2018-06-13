"use strict";
const debug = require('debug')('RSCI.export');
const db = require('./db');
var helpers = require('./helpers');

function quoteWrap(val) {
  return '"' + val + '"';
}

this.getExperimentSessionExportAsCsv = async  function (id, cb) {
  debug('getExperimentSessionExportAsCsv');
  var data = await db.experimentSessionsServer.getList();

    try {
      var output = processsExperimentSessionData(id, data);
      //console.log(output); 
      cb(output); 
    }catch (ex) {
      debug(ex);
    }    
   
};

function escapeDoubleQuotes(str) {
	return str.replace(/\\([\s\S])|(")/g,"\\$1$2"); // thanks @slevithan!
}

function processsExperimentSessionData(id, data) {
  let sessionInfo = [];
  let output = [];
  for (var i = 0; i < data.length; i++) {
    var experimentSession = data[i];

    // experimentId	experimentName	sessionId	sessionStartTime	clientConfig	clientId	clientAction	clientActionTime

    if (id !== experimentSession.experimentSessionId && id !== null) {
      continue;
    }
    console.log('found exp ' + id);

    output.experimentSessionId = id;
    sessionInfo.push(quoteWrap(experimentSession.experimentId));
    sessionInfo.push(quoteWrap(experimentSession.experimentSessionId));
    sessionInfo.push(quoteWrap(experimentSession.sessionStartTime));

    let sessionInfoString = sessionInfo.join(',');


    for (var j = 0; j < experimentSession.clients.length; j++) {
      let clientInfo = [];
      var client = experimentSession.clients[j];
     // console.log(client.clientId);
      clientInfo.push(sessionInfoString);
      clientInfo.push(quoteWrap(client.clientId));
      clientInfo.push(quoteWrap( escapeDoubleQuotes(JSON.stringify(client.config.sessionVariables))));

      let clientInfoString = clientInfo.join(',');

      for (var k = 0; k < client.actions.length; k++) {

        var action = client.actions[k];

        let actionInfo = [];
        actionInfo.push(clientInfoString);
        actionInfo.push(quoteWrap(action.actionTimeStamp));
        actionInfo.push(quoteWrap(action.actionType));
        output.push(actionInfo.join(','));
      }
    }
  }
  return output.join('\n');
}

this.getExperimentSessions = async function (cb) {
  debug('getExperimentSessions');
  var data = await db.experimentSessionsServer.getList();
    var output = [];
    try {
      for (var i = 0; i < data.length; i++) {
        var experimentSession = data[i];
        output.push({
          experimentSessionId: experimentSession.experimentSessionId,
          experimentId: experimentSession.experimentId,
          sessionStartTime: experimentSession.sessionStartTime
        });
      }
      cb(output);
    } catch (ex) {
      console.log(ex);
    }
 

};

module.exports = this;
