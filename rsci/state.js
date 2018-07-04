module.exports = {
    initTimeStamp: new Date(),
    discoveryList: [],
    clientList: [],
    clientUIisAvailable: false,
    ts_ClientUIisAvailable: new Date(),
    experimentSessionsLocal: [],
    listeningPort: 3003,
    cpuInterface: ['eth0', 'en0', 'wlan0', 'enp0s3'],
    server: {
    },
    clientId:'no client id',
    me:{},
    experiments: {
      configDir: './experiments', 
      configs:[]
    }

  };