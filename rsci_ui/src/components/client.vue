<template>
  <div class="client">
    <h1>Client : {{ client.me.clientId }}</h1>
     <input v-model="client.me.clientId" placeholder="clientId">
     <button class = "btn" v-on:click="updateSettings()"> update </button>
    I'm here :)
    <div> Client UI is on: {{ client.clientUIisAvailable }} </div>
    <div> Client UI last updated at: {{ client.ts_ClientUIisAvailable }} </div>
      <div>
        connected to server  <a target="" :href="'http://' + client.server.ip + ':8080/#admin'" >{{ client.server.id }}</a>
      </div>

   <h2>My Session Details</h2>
    <ul id="experimentSessions">
      <li v-for="(sess, index) in client.experimentSessions" :key='index'>
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
  export default {
    name: 'client',
    computed: {
      client () {
        return this.$store.state.client
      }
    },
    mounted () {
      this.$store.dispatch('client_state_get')
    },
    methods: {
      updateSettings: function () {
        this.$store.dispatch('client_post')
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
