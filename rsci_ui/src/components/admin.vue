<template>
  <div class="admin">
    <div class="admin-nav">
      <h1 class="admin-header">Admin {{ id }}</h1>
      <div class="admin-btns">
        <button v-on:click="startJob">Start Rat Job</button>
        <button v-on:click="becomeServer">Become Server</button>
      </div>
    </div>

    <div class="experiment-selector">
      <select>
        <option v-for="experiment in experiments">{{ experiment.name }}</option>
      </select>
    </div>

    <div class="session">
      <h1>Session:</h1>
      {{ currentExperiment.config.sessionLength }}
      <!-- <input type="text">{{ currentExperiment.config.sessionLength }}</input> -->
    </div>

    <div class="boxes">
      <ul id="box-list">
        <li v-for="box in currentExperiment.config.assignedBoxes">
          {{ box.id }} {{ box.available }}
        </li>
      </ul>
    </div>

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
      lastAction: {},
       experiments: [
        {
            name: 'jackies experiment',
            defaultSessionConfig: {
                sessionLength: 30,
                assignedBoxes: [
                    'box1', 'box2', 'box3'
                ]
            }
        },
        {
            name: 'fergs experiment',
            defaultSessionConfig: {
                sessionLength: 60,
                assignedBoxes: [
                    'box1', 'box2', 'box3', 'box4', 'box5'
                ]
            }
        }
    ],
    currentExperiment: {
        name: 'fergs experiment',
        config: {
            sessionLength: 60,
            assignedBoxes: [
                {
                  id: 'box1',
                  available: true
                },
                {
                  id: 'box2',
                  available: true
                },
            ]
        }
    },
    availableBoxes: [
        'box1'
    ],
    sessions:[

      ]
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
.admin-nav {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  border-bottom: 1px solid black;

}
.admin-header, .admin-btns  {
  display: inline-block;
}
.admin-btns {
  margin-top: 10px;
  margin-right: 10px;
}
.experiment-selector {
  padding: 20px;
  border-bottom: 1px solid black;
}
.session {
  display: block;
}

</style>
