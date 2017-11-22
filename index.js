"use strict";

var webApp  = require('./webApp');
console.log('Init Web server');

var discovery = require('./discovery');
console.log('Init Discovery');

var job = require('./job');



var state = {
    id : generateId(),
    initTimeStamp: new Date(),
    discoveryList: [],
    events: [],
    server:{
    }
};

function generateId(){
    return LeftPadWithZeros(Math.floor(Math.random() * 1000000000));
};

function LeftPadWithZeros(number, length)
{
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;
};


function startJob(){

    var j = new job();


    j.on('Start', listener = function (args) {
        console.log("start");
    });
    j.on('Start', listener = function (args) {
        console.log("ButtonPress");
    });

    j.start();
}



function onUpdateState(data){
    state = data;
    console.log('Index - State Change');
};


webApp.init(3000, state, onUpdateState);

var cpuInterface = 'en0';

function start(res) {
    
      console.log('Received friend list');
      console.log(res);
      state.discoveylist = res; 
      state.discoveylist.push({
          ip: '',
          id: state.id,
          initTimeStamp: state.initTimeStamp,
          me: true
      });
      webApp.setProps(state);
      
      state.server = discovery.findServer(state.discoveylist);
      console.log('server', state.server);
      startJob();
  
  
  }

//discovery.search(cpuInterface).then(start);
var fakeDiscoveryLIst = [ 
    { ip: '192.168.100.105',
        id: '266799123',
initTimeStamp: '2017-11-22T05:00:42.975Z' } ];
start(fakeDiscoveryLIst);




