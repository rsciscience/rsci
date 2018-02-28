
<template>
  <div class="admin">
    <div class="section header">
      <div class="row">
        <div class="col-sm-4">
          <h1>Admin:<span class="clientId">{{ me.clientId }}</span></h1>
        </div>
        <div class="col-sm-6">
          <button class ="btn" v-on:click="becomeServer">Become Server</button>
          <button class ="btn" v-on:click="networkRescan">Rescan Network</button>
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
        <experiments v-bind:experimentsList="experiments"></experiments>
      </div>

      <div class="section actvity">
        <h1>Current Session</h1>
        
        <div class="row">
          <div class="col-sm-2">
            <h4>Last Action</h4>
           
          </div>
          <div class="col-sm-10">
            <h2>Session Details</h2>
            <ul id="experimentSessions">
              <li v-for="(sess, index) in experimentSessions" :key='index'>
                session: {{ sess.id }}

                <div class="client"  v-for="client in sess.clients">
                    <div class="box" v-bind:class="{clientactive: isActiveRecient(client)}">
                      {{client.assignedRat}}
                    </div>
                    <div class="name">{{client.name}}</div>
                    <div class="id">({{client.clientId}})</div>
                    <div> {{ lastAction.actionTimeStamp }} </div>
                    <div> {{ lastAction.actionType }} </div>
                    <div class="id"> last <span >{{getLastActionEvntType(client)}}</span></div>
                  </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  <div class="section networkInfo">
    <h1>Network information</h1>
        <span>Server</span> {{ server.ip  }} (me:{{ server.me  }})
    <div class="row">
      <div class="col-sm-6">
        <h2>Clients</h2>
        <ul id="clientlist">
          <li v-for="item in clientList" >
            <a target="" :href="'http://' + item.ip + ':8080/#client'" >{{ item.clientId }}</a>
          </li>
        </ul>
      </div>

      <div class="col-sm-6">
        <h2>Discovery Results</h2>
        <ul id="discoverylist">
          <li v-for="item in discoveryList" >
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
import {HTTP} from '../http-common'

export default {
  name: 'Admin',
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    server_experimentsession_id_client_event: function (val) {
      this.lastAction = val
      console.log('server_experimentsession_id_client_event', val)
    },
    server_network_event: function (val) {
      console.log('server_network_event', val)
      this.me = val.me
      this.server = val.server
      this.discoveryList = val.discoveryList
      this.clientList = val.clientList
    }
  },
  data () {
    return {
      me: '',
      server: {},
      discoveryList: [],
      clientList: [],
      experimentSessions: [],
      lastAction: {},
      experiments: []
    }
  },
  mounted () {
    function err (e) {
      this.errors.push(e)
    }

    function success (response) {
      console.log(response)
      this.me = response.data.me
      this.server = response.data.server
      this.discoveryList = response.data.discoveryList
      this.clientList = response.data.clientList
    }

    HTTP.get('server/network').then(success.bind(this)).catch(err.bind(this))

    function successExperimentsList (response) {
      console.log(response)
      this.experiments = response.data
    }

    HTTP.get('server/experiments/list').then(successExperimentsList.bind(this)).catch(err.bind(this))

    function successExperimentsSessionsList (response) {
      console.log(response)
      this.experimentSessions = response.data
    }

    HTTP.get('server/experiments/sessions').then(successExperimentsSessionsList.bind(this)).catch(err.bind(this))
  },
  methods: {
    becomeServer: function () {
      function err (e) {
        this.errors.push(e)
      }

      function success (response) {
        console.log('Called Server Register!')
      }

      HTTP.post('server/register', {}).then(success.bind(this)).catch(err.bind(this))
    },
    networkRescan: function () {
      function err (e) {
        this.errors.push(e)
      }

      function success (response) {
        console.log('Called Server Network Rescan!')
      }

      HTTP.post('server/network/rescan', {}).then(success.bind(this)).catch(err.bind(this))
    },
    getLastActionEvntType: function (client) {
      return client.actions[client.actions.length - 1].actionType
    },
    isActiveRecient: function (client) {
      return true
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
  color: #d58b8e; 
}
.config{

}
.actvity{

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

.btn {
  -webkit-border-radius: 5;
  -moz-border-radius: 5;
  border-radius: 5px;
  font-family: Arial;
  color: #ffffff;
  font-size: 15px;
  background: #a8997c;
  padding: 5px 10px 5px 10px;
  text-decoration: none;
}

.btn:hover {
  background: #d58b8e;
  text-decoration: none;
}
</style>
