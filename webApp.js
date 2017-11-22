"use strict";

const express = require('express')


const me = {
    app: express(),
    state: {}
}





me.app.get('/discovery',discovery.bind(me));
me.app.get('/discovery/list',discovery_list.bind(me));
me.app.post('/client/job/:id/start',client_job_start.bind(me));
me.app.post('/client/job/:id/stop/start',client_job_start.bind(me));
me.app.post('/server/job/:id/clientEvent',server_job_clinetEvent.bind(me));

me.init = function(port, props , onUpdateParrentState ) {
    this.state = props;
    this.onUpdateParrentState = onUpdateParrentState;
    this.app.listen(3000, () => console.log('Example app listening on port 3000!'));
}.bind(me);

me.setProps = function(props) {
    console.log('WebApp - setProps ');
    this.state.discoveryList = props.discoveryList;
    
}.bind(me);


function discovery (req, res)  {

    function doWork(){

        var output =    {
            id: me.state.id,
            initTimeStamp: this.state.initTimeStamp
        };
        return  JSON.stringify( output);
    }
    
    var clientResponse = {}

    try{
       clientResponse =  doWork(req.body);
    }catch (ex) {
        res.send().status(500)
    }

    res.send(clientResponse);
}

function discovery_list (req, res)  {
    
   function doWork(){

        var output =    {
            id: this.state.id,
            initTimeStamp: this.state.initTimeStamp,
            discoveryList : this.state.discoveryList
        };
        return  JSON.stringify( output);
    }
    
    var clientResponse = {}

    try{
       clientResponse =  doWork(req.body);
    }catch (ex) {
        res.send().status(500)
    }

    res.send(clientResponse);
}

function client_job_start(req, res)  {
    res.send().status(500);
}

function client_job_stop(req, res) {
    res.send().status(500);
}

function server_job_clinetEvent(req, res)  {
    res.send().status(200);
}






console.log(this);
module.exports = me;



