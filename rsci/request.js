const debug = require('debug')('RSCI.API')
const request_lib = require('request-promise')


class request {
  constructor(port) {
    this.port = port
    // handlers
    this.discoveryQuery = this.discoveryQuery.bind(this)
  }

  async discoveryQuery(ip) {
    const options = {
      uri: 'http://' + ip + ':' + this.port + '/discovery',
      json: true,
      timeout: 5000
    }
    debug('Trying: ' + options.uri)
    try {
      const res = await request_lib(options)
      debug('   friend at ' + ip + ':' + this.port)
      return {
        ip: ip,
        port: this.port,
        clientId: res.clientId,
        initTimeStamp: res.initTimeStamp
      }
    } catch (e) {
      debug('no friend at ' + ip + ':' + this.port)
      return null
    }
  }

  async serverHeartbeatCommand(server, clientId, clientUIisAvailable, ts_ClientUIisAvailable) {
    debug('serverHeartbeatCommand')
    const options = {
      uri: 'http://' + server.ip + ':' + server.port + '/server/client/heartbeat',
      json: true,
      method: 'POST',
      body: {
        clientId: clientId,
        clientUIisAvailable: clientUIisAvailable,
        ts_ClientUIisAvailable: ts_ClientUIisAvailable,
      }
    }
    try {
      await request_lib(options)
    } catch (e) {
      // do nothing, we'll try again later
    }
  }
}

module.exports = request