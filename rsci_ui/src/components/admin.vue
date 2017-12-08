<template>
  <div class="admin">
    <h1>Admin dbord for {{ id }}</h1>


    <ul id="discoveryList">
      <li v-for="item in discoveryList">
        {{ item.ip }}
        {{ item.me }}
      </li>
    </ul>

    <ul id="jobs">
      <li v-for="(job, index) in jobs" :key='index'>
        'JobId'
        {{ job.id }}
          <ul id="clients">
          <li v-for="(client, index) in job.clients" :key='index'>
            'ClientId'
            {{ client.id }}
              <ul id="actions">
              <li v-for="(action, index) in client.actions" :key='index'>
                'ActionId'
                {{ action.eventType }}
                {{ action.eventTimeStamp }}
              </li>
    </ul>
          </li>
    </ul>
      </li>
    </ul>

    <button v-on:click="startJob">Start Rat Job</button>

  </div>
</template>

<script>
import {HTTP} from '../http-common'
// import {io} from '../socket.io.js'
// const io = require('socket.io-client')

export default {
  name: 'Admin',
  data () {
    return {
      id: '',
      discoveryList: [],
      jobs: [{ip: '1231244'}]
    }
  },
  mounted () {
    var socket = io.connect('http://localhost:3003')
    socket.on('news', function (data) {
      console.log(data)
      socket.emit('my other event', { my: 'data' })
    })

    function err (e) {
      this.errors.push(e)
    }

    function success (response) {
      console.log(response)
      this.id = response.data.id
      this.discoveryList = response.data.discoveryList
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
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
