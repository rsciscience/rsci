module.exports = {
    initTimeStamp: new Date(),
    discoveryList: [],
    clientList: [],
    experimentSessions: [],
    experimentSessionsLocal:[],
    listeningPort: 3003,
    cpuInterface: ['eth0', 'en0', 'wlan0', 'enp0s3'],
    server: {
    },
    me:{},
    experiments: {
      configDir: './experiments', 
      configs:[]
    }

  };