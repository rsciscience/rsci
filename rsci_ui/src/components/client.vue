<template>
  <div class="client">
    <h1>Client : {{ me.clientId }}</h1>
     <input v-model="me.clientId" placeholder="clientId">
     <button class = "btn" v-on:click="updateSettings()"> update </button>
    I'm here :)
    <div> Client UI is on: {{ clientUIisAvailable }} </div>
    <div> Client UI last updated at: {{ ts_ClientUIisAvailable }} </div>
      <div>
        connected to server  <a target="" :href="'http://' + server.ip + ':8080/#admin'" >{{ server.id }}</a>
      </div>

   <h2>My Session Details</h2>
    <ul id="experimentSessions">
      <li v-for="(sess, index) in experimentSessions" :key='index'>
       <h3> {{ sess.experimentId }} : {{ sess.experimentSessionId }} ( {{ sess.sessionStartTime }} )</h3>
        <ul id="actions">
          <li v-for="(action, index) in sess.actions" :key='index'>
            {{ action.actionTimeStamp }} <b>{{ action.actionType }} </b>
          </li>
        </ul>
      </li>
    </ul>

  </div>
</template>



<script>
  import {HTTP} from '../http-common'
  export default {
    name: 'client',
    data () {
      return {
        me: {},
        server: {},
        experimentSessions: [],
        clientUIisAvailable: false,
        ts_ClientUIisAvailable: new Date()
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
        this.experimentSessions = response.data.experimentSessionsLocal
        this.clientUIisAvailable = response.data.clientUIisAvailable
        this.ts_ClientUIisAvailable = response.data.ts_ClientUIisAvailable
      }

      HTTP.get('client/state').then(success.bind(this)).catch(err.bind(this))
    },
    methods: {
      updateSettings: function () {
        function err (e) {
          this.errors.push(e)
        }

        function success (response) {
          console.log('Updated!')
        }

        HTTP.post('client', {clientId: this.me.clientId}).then(success.bind(this)).catch(err.bind(this))
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
  margin-left:10px;
}
a {
  color: #42b983;
}
</style>
