
<template>
  <div class="admin">
    <h3>RSCI Admin on {{ me.id }}</h3>

    <button v-on:click="becomeServer">Become Server</button>

    <experiments v-bind:experimentsList="experiments"></experiments>


    <h1>Current Session</h1>
    
    <div class="row">
      <div class="col-sm-2">
        <h4>Last Action</h4>
        <div> {{ lastAction.eventTimeStamp }} </div>
        <div> {{ lastAction.eventType }} </div>
      
       
      </div>
      <div class="col-sm-10">
     
    
  
    <h2>Session Details</h2>
    <ul id="experimentSessions">
      <li v-for="(sess, index) in experimentSessions" :key='index'>
        session: {{ sess.id }}
        <ul id="clients">
          <li v-for="(client, index) in sess.clients" :key='index'>
            ClientId: {{ client.id }}
            <ul id="actions">
              <li v-for="(action, index) in client.actions" :key='index'>
                {{ action.eventType }} {{ action.eventTimeStamp }}
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

     </div>
      </div>

  <div class="networkInfo">
<h1>Network information</h1>
    <div class="row">
      <div class="col-sm-4">
        <h2>Server</h2>
        {{ server.ip  }}
        {{ server.me  }}
      </div>

      <div class="col-sm-4">
        <h2>Clients</h2>
        <ul id="clientlist">
          <li v-for="item in clientList" >
            <a target="" :href="'http://' + item.ip + ':8080/#client'" >{{ item.id }}</a>
          </li>
        </ul>
      </div>

      <div class="col-sm-4">
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
    server_experiment_id_event: function (val) {
      this.lastAction = val
      console.log('server_experiment_id_event', val)
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
        console.log('Became Server!')
      }

      HTTP.post('server/register', {}).then(success.bind(this)).catch(err.bind(this))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
