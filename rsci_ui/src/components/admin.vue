
<template>
  <div class="admin">
    <div class="section header">
      <div class="row">
        <div class="col-sm-2">
          <h1>Admin:</h1>
        </div>
        <div class="col-sm-3" style="margin-top:11px;">
          <span class="clientId">{{ admin.me.clientId }}</span>
        </div>
        <div class="col-sm-5" style="margin-top:11px;text-align:right;padding-right:10px;">
          <a href="javascript:void(0)" v-on:click="becomeServer">Become Server</a>
          |
          <a href="javascript:void(0)" v-on:click="networkRescan">Rescan Network</a>
           |
             <a  href="javascript:void(0)" v-on:click="experimentsRefresh">Reload Experiments</a>
           |
          <router-link to="/export">Export</router-link>
        </div>
        <div class="col-sm-2">
          RSCI
          <img class ="logo" src="/src/assets/logo.png" alt="">
        </div>
      </div>
    </div>

    <div class="content">
      <div class="section config">
        <experiments v-bind:experimentsList="admin.experiments" v-bind:initialConfig="admin.initialConfig" @selectExperiment="getExperimentInitialConfig"></experiments>
      </div>

      <div class="section actvity">
        <experimentCurrent v-bind:experimentSession="admin.experimentSessionCurrent" v-show="admin.experimentSessionCurrent.running"></experimentCurrent>
      </div>
    </div>
  <div class="section networkInfo">
    <h2>Network</h2>
    <div class="row">
      <div class="col-sm-2">

      </div>
      <div class="col-sm-10">
        <span>Server</span> {{ admin.server.ip  }} (me:{{ admin.server.me  }})
      </div>
    </div>


    <div class="row">
      <div class="col-sm-2">

      </div>
      <div class="col-sm-5">
        <b>Clients</b>
        <ul id="clientlist" >
          <li v-for="item in admin.clientList" v-bind:key="item.clientId" >
            <a target="" :href="'http://' + item.ip + ':8080/#client'" >{{ item.clientId }}</a>
          </li>
        </ul>
      </div>

      <div class="col-sm-5">
        <b>Discovery Results</b>
        <ul id="discoverylist">
          <li v-for="item in admin.discoveryList" v-bind:key="item.ip">
            {{ item.ip }}
            <span  v-if="item.me" >Me</span>
          </li>
        </ul>
      </div>
    </div>
  </div>



  </div>
</template>

<script>

export default {
  name: 'Admin',
  computed: {
    admin () {
      return this.$store.state.admin
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    server_experimentsession_id_client_action: function (val) {
      console.log('server_experimentsession_id_client_action', val)
      this.experimentSessionCurrent = val
    },
    server_network_event: function (val) {
      console.log('server_network_event', val)
      const $admin = this.$store.state.admin
      $admin.me = val.me
      $admin.server = val.server
      $admin.discoveryList = val.discoveryList
      $admin.clientList = val.clientList

      $admin.initialConfig.map((configClient) => {
        const client = $admin.clientList.find((client) => {
          return client.clientId === configClient.clientId
        })

        configClient.isOnline = false
        configClient.clientUIisAvailable = false

        if (client) {
          configClient.isOnline = true
          configClient.clientUIisAvailable = client.clientUIisAvailable
        }
      })
    }
  },
  mounted () {
    this.$store.dispatch('server_network_get')
    this.$store.dispatch('server_experiment_list_get')
    this.$store.dispatch('server_experiments_session_get')
  },
  methods: {
    becomeServer: function () {
      this.$store.dispatch('server_register_post')
    },
    experimentsRefresh: async function () {
      await this.$store.dispatch('server_experiments_reload_post')

      this.$store.dispatch('server_experiment_list_get')
    },
    networkRescan: function () {

    },
    isActiveRecient: function (client) {
      return true
    },
    getExperimentInitialConfig (id) {
      this.$store.dispatch('server_experiment')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



.logo{
  height: 40px;
}
.section{
  margin-bottom:30px;
  padding:5px;
}

.header{
  background-color: #323232;
  color: white;
}
.header h1{
  margin:0;
  display: inline;
}
.header .btn{
  margin-top: 10px;
}
.clientId{
  font-size: 18px;
  font-weight: bold;
  color: #d58b8e;
}
.config{

}
.actvity{
  padding-top: 20px;
  padding-bottom: 20px;
}
.content {
  flex: 1 0 auto;
}

.networkInfo{
 background-color: #cbad9d;
  flex-shrink: 0;
 margin-bottom:0px;
}


ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: white;
}


  .box {
    background: darkgrey;
    border: 5px solid gray;
    width: 80px;
    height: 80px;
    color: white;
    text-align:center;
  }
  .name{

    font-size :10px;
  }
  .id{
    font-size :10px;
  }
  .clientactive {
    background: green;
    border: 5px solid rgb(1, 85, 1);
  }


</style>
