<template>
  <div class="client">
    <h1>Client : {{ me.clientId }}</h1>
     <input v-model="me.clientId" placeholder="clientId"> 
     <button v-on:click="updateSettings()"> update </button>
    I'm here :)
      <div>
        connected to server  <a target="" :href="'http://' + server.ip + ':8080/#admin'" >{{ server.id }}</a>
      </div>

   <h2>My Session Details</h2>
    <ul id="experimentSessions">
      <li v-for="(sess, index) in experimentSessions" :key='index'>
        session: {{ sess.id }}
        <ul id="clients">
          <li v-for="(client, index) in sess.clients" :key='index'>
            <div>
            ClientId: {{ client.clientId }}
            </div>
            <ul id="actions">
              <li v-for="(action, index) in client.actions" :key='index'>
                {{ action.actionTimeStamp }} <b>{{ action.actionType }} </b>
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
    name: 'client',
    data () {
      return {
        me: {},
        server: {},
        experimentSessions: []
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
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
