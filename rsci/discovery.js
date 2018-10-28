const debug = require('debug')('RSCI.discovery')
const arpScanner = require('arpscan/promise')
const request = require('request-promise')


class discovery {
  constructor(port) {
    this.port = port
    // handlers
    this._callNetworkDevice = this._callNetworkDevice.bind(this)
  }

  async search(interfaces) {
    debug('search')
    const arpScanLists = await Promise.all(interfaces.map(this._arp_scan))
    const networkDeviceList = arpScanLists.reduce((a, b) => a.concat(b), [])
    const friendsList = await Promise.all(networkDeviceList.map(this._callNetworkDevice))
    return friendsList.filter(f => f !== null)
  }

  async _arp_scan(int) {
    let results = []
    debug('  Trying Interface: ' + int)
    try {
      results = await arpScanner({ interface: int, sudo: true })
      debug('arpscan result', results)
    } catch (e) {
      if (e == 127) {
        console.log('check arp scanner is installed  (sudo apt-get install arp-scan)')
      }
      debug('Failed on interface: ' + int + ' err code:', e)
    }
    return results
  }

  async _callNetworkDevice(networkDevice) {
    const options = {
      uri: 'http://' + networkDevice.ip + ':' + this.port + '/discovery',
      json: true,
      timeout: 5000
    }
    debug('Trying: ' + options.uri)
    try {
      const res = await request(options)
      debug('   friend at ' + networkDevice.ip + ':' + this.port)
      return {
        ip: networkDevice.ip,
        port: this.port,
        clientId: res.clientId,
        initTimeStamp: res.initTimeStamp
      }
    } catch (e) {
      debug('no friend at ' + networkDevice.ip + ':' + this.port)
      return null
    }
  }

  findServer(networkDeviceList) {
    debug('findServer')
    if (!networkDeviceList || networkDeviceList.length <= 0) return null
    return networkDeviceList.reduce((a, b) => new Date(a.initTimeStamp) < new Date(b.initTimeStamp) ? a : b)
  }
}


module.exports = discovery
