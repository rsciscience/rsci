const arpScanner = require('arpscan/promise');
const request = require('request-promise');

this.arpScanner = arpScanner;

this.search = search.bind(this);

async function search (interface) {

    var res;
    try {
        res = await this.arpScanner({ interface: interface, sudo: true });
    }  catch(e) {
        res = [];
        console.log(e);
    }
    var results =  await findFriends(res);
    this.lastSearchResults = results;
    return results;
};

async function findFriends(networkDeviceList) {

    async function callNetworkDevice(networkDevice) {
        var options = {
            uri: 'http://' + networkDevice.ip + ':3000/discovery',
            json: true
        };
        
        try {
            let res = await request(options);
            
            console.log('   friend at ' + networkDevice.ip);

            return   {
                ip: networkDevice.ip, 
                id: res.id,
                initTimeStamp: res.initTimeStamp
            };
        } catch(e) {
            console.log('no friend at ' + networkDevice.ip);
            return null;
        }
    }


    let friendsList = await Promise .all(networkDeviceList.map(callNetworkDevice));

    function cleanFriendLIst(actual) {
        var newArray = new Array();
        for (var i = 0; i < actual.length; i++) {
          if (actual[i]) {
            newArray.push(actual[i]);
          }
        }
        return newArray;
      }

      return cleanFriendLIst(friendsList);  
};

this.findServer= function (networkDeviceList) {
    console.log('findServer');
    var output = {};

    var oldestNetworkDevice = null;

    for (var i = 0, len = networkDeviceList.length; i < len; i++) {
        var device =  networkDeviceList [i];
        if( oldestNetworkDevice == null){
            oldestNetworkDevice =  device ;
            continue;  
        }
        if(oldestNetworkDevice.initTimeStamp <  device.initTimeStamp){
            oldestNetworkDevice =  device ;
        }

    }    
    output = oldestNetworkDevice;
    return output;
}



module.exports = this;
