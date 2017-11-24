"use strict";

const debug = require('debug')('index.');


var webApp  = require('./webApp');
debug('Init Web server');

var discovery = require('./discovery');
debug('Init Discovery');

const request = require('request-promise');

var job = require('./job');


this.state = {
    id : generateId(),
    initTimeStamp: new Date(),
    discoveryList: [],
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


function startJob(){
    this.state.job= {
        id:'JB_' + generateId()
    };
    var j = new job();

    function watchJobEvents (args){
       debug('CLIENT:Calling home');
        sendServerJobEvent(args,this.state.server.ip, this.state.listeningPort, this.state.id ,this.state.job.id)
    }

    j.on('Start',watchJobEvents.bind(this));
    j.on('ButtonPress', watchJobEvents.bind(this));
    j.on('Light', watchJobEvents.bind(this));

    j.start();
}



async function sendServerJobEvent(data, serverip, port,clientId,  jobId){
    serverip = '192.168.100.105';
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
    this.debug('Discovery List has ' +  discoveryList.length);
    this.state.discoveylist = discoveryList; 
    this.state.discoveylist.push({
        ip: '',
        id: this.state.id,
        initTimeStamp: this.state.initTimeStamp,
        me: true
    });
    webApp.setProps(this.state);

    this.state.server = discovery.findServer(this.state.discoveylist);
    debug('server', this.state.server.id);
    if (this.state.server.me ){
        debug('I\'m the server');
    }else{
        lastSearchResults();
    }


}.bind(this);


this.init = function(){
    debug('init');

    webApp.init(this.state.listeningPort, this.state, this.onUpdateState);


    var fakeDiscoveryLIst = [ 
        { ip: '192.168.100.105',
            id: '266799123',
            initTimeStamp: '2017-11-22T05:00:42.975Z' } ];


    discovery.search(this.state.cpuInterface,this.state.listeningPort).then(this.start);


    setInterval(dumpJobs.bind(this,this.state.jobs),15000);


}.bind(this);



this.init();



