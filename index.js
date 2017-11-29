"use strict";
var ip = require('ip');
const debug = require('debug')('RSCI.index.');


var webApp  = require('./webApp');
debug('Init Web server');

var discovery = require('./discovery');
debug('Init Discovery');

const request = require('request-promise');

var job = require('./job');
this.client = {};
this.server = {};

this.state = {
    id : generateId(),
    initTimeStamp: new Date(),
    discoveryList: [],
    clientList: [],
    jobs:[],
    listeningPort: 3003,
    cpuInterface : ['en0','wlan0' ],
    server:{
    }
};

function generateId(){
    return leftPadWithZeros(Math.floor(Math.random() * 1000000000));
};

function leftPadWithZeros(number, length)
{
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;
};


this.client.startJob = function(jobId) {
    debug('client.startJob');
    debug(this);
    this.state.job= {
        id: jobId
    };
    var j = new job();

    function watchJobEvents (args){
        sendServerJobEvent(args,this.state.server.ip, this.state.listeningPort, this.state.id ,this.state.job.id)
    }

    j.on('Start',watchJobEvents.bind(this));
    j.on('ButtonPress', watchJobEvents.bind(this));
    j.on('Light', watchJobEvents.bind(this));
    j.on('theFerg', watchJobEvents.bind(this));

    j.start();
    return {
        clientId: this.state.id,
        jobStartDate: new Date(),
        jobId: jobId
    };
}.bind(this);

this.client.registerWithServer = async function(payload, serverip, port) {
    debug('client.registerWithServer');

        var options = {
            uri: 'http://' + serverip + ':'+port+'/server/client/add',
            json: true,
            method:'POST',
            body: payload
        };
    
        try {
            let res = await request(options);
        } catch(e) {
            debug('Error registering client');
        }
    
}.bind(this);



this.server.startJob = async function(jobId) {
    debug('server.startJob');

    var payload = {
        jobId: generateId()
    };

    var port = this.state.listeningPort;

    async function sendClientJobStart(client){
        debug('sendClientJobStart');

        var options = {
            uri: 'http://' + client.ip + ':'+ port +'/client/job/start',
            json: true,
            method:'POST',
            body: payload
        }
        
        ;

        try {
            let res = await request(options);
        return res;

        } catch(e) {
            debug('Error sending job event');
        }
        return null;
    }

    let calledClients = await Promise.all(this.state.clientList.map(sendClientJobStart));

    return {
        clientList: calledClients,
        jobStartDate: new Date(),
        jobId: jobId
    };

}.bind(this);


this.server.addClient = function(client) {
    debug('server.addClient');

    var isNewClient = true;

   for (var i = 0; i < this.state.clientList.length; i++) {
        if (this.state.clientList[i].ip === client.ip) {
            isNewClient = false;
        }
   }

   if (isNewClient) {
    this.state.clientList.push(client);
   }
   return this.state.clientList;

}.bind(this);



async function sendServerJobEvent(data, serverip, port,clientId,  jobId){
    debug('sendServerJobEvent');
    var options = {
        uri: 'http://' + serverip + ':'+port+'/server/job/'+jobId +'/'+clientId +'/event',
        json: true,
        method:'POST',
        body:data
    };

    try {
        let res = await request(options);
    } catch(e) {
        debug('Error sending job event');
    }

}



this.onUpdateState= function (data){
    this.state = data;
    //debug('Index - State Change');
};


function dumpJobs(jobs) {
    debug('FriendlyJobStatusDump');
    debug("Job Count:" + jobs.length) ;

    for (var i = 0, len = jobs.length ; i < len; i++) {
        var job = this.state.jobs[i];
        debug("Job:" + job.id);
        debug(job.clients.length) ;

        for (var j = 0, lenj = job.clients.length  ; j < lenj; j++) {

            var client  = job.clients[j];
            debug('  Client:' + client.id);
            debug(client.actions.length) ;

            for (var k = 0, lenk = client.actions.length-1 ; k < lenk; k++) {
                var action = client.actions[k]
                debug('    ' + action.eventType);

            }

        }

    }

}



this.start = function (discoveryList) {

    debug('start');
    debug('Received friend list');
    debug('Discovery List has ' +  discoveryList.length);
    this.state.discoveryList = discoveryList; 
    let me = {
        ip: ip.address(),
        id: this.state.id,
        initTimeStamp: this.state.initTimeStamp,
        me: true
    };
    this.state.discoveryList.push(me);
    webApp.setProps(this.state);

    this.state.server = discovery.findServer(this.state.discoveryList);
    debug('server' , this.state.server);
    debug('server' , this.state.server.id);
    debug('server me ' , this.state.server.me);
    if (this.state.server.me == true ){
        debug('I\'m the server');
        setInterval(dumpJobs.bind(this,this.state.jobs),15000);
    }else{
        debug('I\'m the client');
        var payload = { ip: me.ip, id: me.id, initTimeStamp: me.initTimeStamp }
        this.client.registerWithServer( payload, this.state.server.ip, this.state.listeningPort);
    }

    this.state.clientList =  [];

    for (var i = 0, len = this.state.discoveryList; i < len; i++) {
        var client = this.state.discoveryList[i];
        if(client.ip != this.state.server.ip ){
            this.state.clientList.push(client);
        } 
    }


}.bind(this);




this.init = function(){
    debug('init');

    webApp.init(this.state.listeningPort, this.state, this.onUpdateState, this.client, this.server);


    var fakeDiscoveryLIst = [
        {
            "ip": "192.168.100.137",
            "id": "229449991",
            "initTimeStamp": "2018-11-29T03:08:43.158Z"
        }
    ];

    this.start(fakeDiscoveryLIst);
    //discovery.search(this.state.cpuInterface,this.state.listeningPort).then(this.start);




}.bind(this);



this.init();



