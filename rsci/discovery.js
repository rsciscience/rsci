const debug = require('debug')('RSCI.discovery');
const arpScanner = require('arpscan/promise');
const request = require('request-promise');


this.search = async function (interfaces, port) {
    debug('search');
    var res = [];
    for (var i = 0, len = interfaces.length; i < len; i++) {
        var int = interfaces[i];
        debug('  Trying Interface: ' + int + ' on port ' + port);
        var partResults = [];
        try {
            partResults = await arpScanner({ interface: int, sudo: true });
        } catch (e) {
            if (e == 127) {
                console.log('check arp scanner is installed  (sudo apt-get install arp-scan)');
            }
            debug('Failed on interface: ' + int + ' err code:', e);
        }
        res = res.concat(partResults);
    }
    return findFriends(res, port);
}

async function findFriends(networkDeviceList, port) {
    debug('findFriends');

    async function callNetworkDevice(networkDevice) {
        var options = {
            uri: 'http://' + networkDevice.ip + ':' + port + '/discovery',
            json: true,
            timeout: 5000
        };
        debug('Trying: ' + options.uri);
        try {
            let res = await request(options);
            debug('   friend at ' + networkDevice.ip + ':' + port);
            return {
                ip: networkDevice.ip,
                port: port,
                clientId: res.clientId,
                initTimeStamp: res.initTimeStamp
            };
        } catch (e) {
            debug('no friend at ' + networkDevice.ip + ':' + port);
            return null;
        }
    }

    let friendsList = await Promise.all(networkDeviceList.map(callNetworkDevice));
    return friendsList.filter((f) => { return f !== null; });
}

this.findServer = function (networkDeviceList) {
    debug('findServer');
    var oldestNetworkDevice = networkDeviceList[0] || null;
    for (var i = 0, len = networkDeviceList.length; i < len; i++) {
        var device = networkDeviceList[i];
        debug(device.clientId);
        if (new Date(device.initTimeStamp) < new Date(oldestNetworkDevice.initTimeStamp)) {
            oldestNetworkDevice = device;
        }
    }
    return oldestNetworkDevice;
}


module.exports = this;
