<template>
  <div class="admin">
    <h1>Admin {{ id }}</h1>
    <button v-on:click="startJob">Start Rat Job</button>
    <button v-on:click="becomeServer">Become Server</button>

    <h2>Server</h2>
    {{ server.ip  }}
    {{ server.me  }}

    <h2>Clients</h2>
    <ul id="clientlist">
      <li v-for="item in clientList">
        {{ item.ip }} ({{ item.id }})
      </li>
    </ul>

    <h2>Discovery Results</h2>
    <ul id="discoverylist">
      <li v-for="item in discoveryList">
        {{ item.ip }} 
        <span  v-if="item.me" >Me</span>
      </li>
    </ul>


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
      lastAction: {}
    }
  },
  mounted () {
   // this.$socket.emit('onevent', {})

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

    HTTP.get('client/state').then(success.bind(this)).catch(err.bind(this))
  },
  methods: {
    startJob: function () {
      function err (e) {
        this.errors.push(e)
      }

      function success (response) {
        console.log('Job Started!')
      }

      HTTP.post('server/job/start', { jobId: '1234' }).then(success.bind(this)).catch(err.bind(this))
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
