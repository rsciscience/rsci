module.exports = {
    initTimeStamp: new Date(),
    discoveryList: [],
    clientList: [],
    clientUIisAvailable: false,
    ts_ClientUIisAvailable: new Date(),
    serverisAvailable: false,
    ts_serverisAvailable: new Date(),
    experimentSessionsLocal: [],
    listeningPort: 8080,
    heartbeat_interval: 10000,
    cpuInterface: ['eth0', 'en0', 'wlan0', 'enp0s3', 'enp0s18f2u1', 'wlp8s0'],
    server: { },
    clientId: 'no client id',
    me: { },
    experiments: {
      configDir: './experiments', 
      configs: []
    }
  }