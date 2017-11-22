const arpScanner = require('arpscan/promise');
const request = require('request-promise');
const me= {
    arpScanner: arpScanner,
    
}
me.search = search.bind(me);

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

    return friendsList;
};

this.findServer= function (networkDeviceList) {

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

    return output
}



module.exports = me
