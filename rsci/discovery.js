const debug = require('debug')('RSCI.discovery')
const arpScanner = require('arpscan/promise')


class discovery {
  constructor(discoveryQuery) {
    // actions
    this.discoveryQuery = discoveryQuery
  }

  async search(interfaces) {
    debug('search')
    const arpScanLists = await Promise.all(interfaces.map(this._arp_scan))
    const ipList = []
    for(let l of arpScanLists)
      l.map(x => ipList.push(x.ip))
    const friendsList = await Promise.all(ipList.map(this.discoveryQuery))
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

  findServer(networkDeviceList) {
    debug('findServer')
    if (!networkDeviceList || networkDeviceList.length <= 0) return null
    return networkDeviceList.reduce((a, b) => new Date(a.initTimeStamp) < new Date(b.initTimeStamp) ? a : b)
  }
}


module.exports = discovery
