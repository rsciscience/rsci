"use strict";
const debug = require('debug')('RSCI.export');
this.state = require('./state');
var helpers = require('./helpers');

function  quoteWrap(val) {
  return '"' + val + '"';
}

this.getExperimentSessionExportAsCsv = function (id) {
  debug('getExperimentSessionExportAsCsv');
  let sessionInfo = [];
  let output = [];
  id = this.state.experimentSessions[0].id;
  for (var i = 0; i < this.state.experimentSessions.length; i++) {
    var experimentSession = this.state.experimentSessions[i]; 
    console.log(experimentSession.id);
// experimentId	experimentName	sessionId	sessionStartTime	clientConfig	clientId	clientAction	clientActionTime
    
    if(id != experimentSession.id) {
      continue;
    }
    console.log('found exp ' + id);
      output.id = id;
      sessionInfo.push(quoteWrap(experimentSession.sessionVariables.config.id));
      sessionInfo.push(quoteWrap(experimentSession.sessionVariables.config.name));
      sessionInfo.push(quoteWrap(experimentSession.sessionVariables.config.version));
      sessionInfo.push(quoteWrap(experimentSession.id));
      sessionInfo.push(quoteWrap(experimentSession.sessionStartTime));
      
      let sessionInfoString = sessionInfo.join(',');


      for (var j = 0; j < experimentSession.clients.length; j++) {
        let clientInfo = [];
        var client = experimentSession.clients[j];
        console.log(client.clientId);
        clientInfo.push(sessionInfoString);
        clientInfo.push(quoteWrap(client.clientId));
        clientInfo.push(quoteWrap('config???'));

        let clientInfoString  = clientInfo.join(','); 
        
        for (var k = 0; k < client.actions.length; k++) {
          
          var action = client.actions[k];
          
          let actionInfo = [];
          actionInfo.push(clientInfoString);
          actionInfo.push(quoteWrap(action.actionType));
          actionInfo.push(quoteWrap(action.actionTimeStamp));

          output.push(actionInfo.join(','));
        }
      }
    }
    console.log(output.join('\n'));
    return output.join('\n');
};

this.getExperimentSessions = function (){
  debug('getExperimentSessions');
  var output = [];
  for (var i = 0; i < this.state.experimentSessions.length; i++) {
    var experimentSession = this.state.experimentSessions[i]; 
    console.log(helpers.printObjetStructure(experimentSession));
    output.push({
      id: experimentSession.id,
      name: experimentSession.sessionVariables.config.name,
      type: experimentSession.sessionVariables.config.type,
      sessionStartTime: experimentSession.sessionStartTime
    });
  }
  return output;

};

module.exports = this;
