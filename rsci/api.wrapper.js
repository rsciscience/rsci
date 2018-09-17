"use strict";
const debug = require('debug')('RSCI.API.wrapper');

function standardWrapper(apiHandlerName, handlerFunction, postEvent) {
    return (req, res) => {
              debug(apiHandlerName);
              function doWork(input){
                var output = handlerFunction(input);
                if (postEvent) {
                  postEvent(output);
                }
                return  JSON.stringify( output);
              }
            
              var clientResponse = {}
            
              try{
                clientResponse =  doWork.bind(this, req.body)();
              }catch (ex) {
                debug(ex);
                res.status(500).send('Something broke!')
                return;
              }
            
              res.send(clientResponse);
            }
  }

  function callbackWrapper(apiHandlerName, handlerFunction, postEvent) {
    return (req, res) => {
              debug(apiHandlerName);
                function doWork(cb){
                 handlerFunction(cb);
                };
              
                function cb(output) {
                if (postEvent) {
                    postEvent(output);
                }
                  const clientResponse = JSON.stringify(output);
                  res.send(clientResponse);
                }
                
                try{
                  doWork.bind(this)(cb);
                }catch (ex) {
                  debug(ex);
                  res.status(500).send('Something broke!')
                  return ;
                }
            }
  }

  function asyncWrapper(apiHandlerName, handlerFunction, getArgsListFunction, postEvent) {
    return (req, res) => {
              debug(apiHandlerName);
                async function doWork(argumentList, cb){
                 var boundHandlerFunction = handlerFunction.bind.apply(handlerFunction, [null].concat(argumentList));
                 var output = await boundHandlerFunction();
                 cb(output);
                };
              
                function cb(output) {
                if (postEvent) {
                    postEvent(output);
                }
                  const clientResponse = JSON.stringify(output);
                  res.status(200).send(clientResponse);
                }
                
                try{
                  argumentList = getArgsListFunction(req);
                  doWork.bind(this)(argumentList, cb);
                }catch (ex) {
                  debug(ex);
                  res.status(500).send('Something broke!')
                  return ;
                }
            }
  }

  this.async = asyncWrapper;
  this.standard = standardWrapper;
  this.callback = callbackWrapper;
  
  module.exports = this;