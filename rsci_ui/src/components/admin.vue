
<template>
  <div class="admin">
    <h1>Admin {{ id }}</h1>


    <button v-on:click="becomeServer">Become Server</button>
    <experiments experimentsList="experiments"></experiments>


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
            {{ item.ip }} ({{ item.id }})
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

    <h2>Last Action</h2>
    <h1> {{ lastAction.eventType }}  {{ lastAction.eventTimeStamp }} </h1>



    <h2>Job Details</h2>
    <ul id="jobs">
      <li v-for="(job, index) in jobs" :key='index'>
        Job: {{ job.id }}
        <ul id="clients">
          <li v-for="(client, index) in job.clients" :key='index'>
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
</template>

<script>
import {HTTP} from '../http-common'

export default {
  name: 'Admin',
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    server_job_id_event: function (val) {
      this.lastAction = val
      console.log('server_job_id_event', val)
    }
  },
  data () {
    return {
      id: '',
      server: {},
      discoveryList: [],
      clientList: [],
      jobs: [{ip: '1231244'}],
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
      this.id = response.data.id
      this.server = response.data.server
      this.discoveryList = response.data.discoveryList
      this.clientList = response.data.clientList
      this.jobs = response.data.jobs
    }

    HTTP.get('server/state').then(success.bind(this)).catch(err.bind(this))

    function successExperimentsList (response) {
      console.log(response)
      this.experiments = response.data
    }

    HTTP.get('server/experiments/list').then(successExperimentsList.bind(this)).catch(err.bind(this))
  },
  methods: {
    startExperiment: function (config) {
      function err (e) {
        this.errors.push(e)
      }
      function success (response) {
        console.log('Experiment Started!')
      }
      HTTP.post('server/experiment/' + config.id + '/start', config).then(success.bind(this)).catch(err.bind(this))
    },

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
h1, h2 {
  font-weight: normal;
}
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
