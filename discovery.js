const arpScanner = require('arpscan/promise');
const request = require('request-promise');
const output = {
    arpScanner: arpScanner,
    
}
output.search = search.bind(output);

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
            console.log(response.statusCode);
            console.log(response.headers['content-type']);
            console.log(body);
            return {ip: ip, initTimeStamp: 'initTimeStamp' }
        } catch(e) {
            console.log('no friend at ' + networkDevice.ip);
            return null;
        }
    }

    let friendsList = await Promise .all(networkDeviceList.map(callNetworkDevice));

    return friendsList;
};


module.exports = output;