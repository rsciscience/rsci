const debug = require('debug')('RSCI.discovery');
const arpScanner = require('arpscan/promise');
const request = require('request-promise');


this.search = async function (interfaces, port) {
    debug('search');
    debug('Port', port);
    var res = [];

    for (var i = 0, len = interfaces.length; i < len; i++) {
        var interface  = interfaces[i];
        debug('  Trying Interface: ' + interface);
        var partResults = [];
        try {
            partResults = await arpScanner({ interface: interface, sudo: true });
        }  catch(e) {
            if(e == 127) {
                console.log('check arp scanner is installed  (sudo apt-get install arp-scan)');
            }
            debug('Failed on interface: ' + interface  + ' err code:', e);
        } 
        res = res.concat(partResults);
    }
    return findFriends(res, port);
};

async function findFriends(networkDeviceList, port) {
    debug('findFriends');
    debug('Port', port);
    
    async function callNetworkDevice(networkDevice) {
        var options = {
            uri: 'http://' + networkDevice.ip + ':'+port+'/discovery',
            json: true,
            timeout:5000
        };
        debug('Trying: ' + options.uri );
        try {
            let res = await request(options);
            debug('   friend at ' + networkDevice.ip);
            return {
                ip: networkDevice.ip, 
                clientId: res.clientId,
                initTimeStamp: res.initTimeStamp
            };
        } catch(e) {
            debug('no friend at ' + networkDevice.ip);
            return null;
        }
    }

    let friendsList = await Promise.all(networkDeviceList.map(callNetworkDevice));
    return friendsList.filter((f) => { return f !== null; });
};

this.findServer = function (networkDeviceList) {
    debug('findServer');
    var output = {};
    var oldestNetworkDevice = null;

    for (var i = 0, len = networkDeviceList.length; i < len; i++) {
        var device =  networkDeviceList [i];
        debug(device.clientId);
        if( oldestNetworkDevice == null){
            oldestNetworkDevice =  device ;
            continue;  
        }
        if( new Date( device.initTimeStamp) < new Date(oldestNetworkDevice.initTimeStamp))  {
            oldestNetworkDevice =  device ;
        }
    }    
    output = oldestNetworkDevice;
    return output;
}


module.exports = this;
