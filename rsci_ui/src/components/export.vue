<template>
  <div>
    <div class="export">
      <!-- <input v-model="experimentSessionId" placeholder="edit me" /> -->
    <h2>Sessions</h2>
    </div>
    <div class="container">
    <div class="row experiment-sessions"  v-for="session in experimentSessionList">
      <div class="col-sm">
        {{ session.id}}
      </div>
      <div class="col-sm">
        {{ session.name }} {{ session.type }}
      </div>
      <div class="col-sm">
        {{ session.sessionStartTime }}
      </div>
      <a :href="HTTP.baseURL + 'server/export/session/' + session.id" target="_blank">CSV</a>
    </div>
  </div>
</div>
</template>

<script>
  import {HTTP} from '../http-common'
  export default {
    name: 'client',
    data () {
      return {
        experimentSessionList: [],
        HTTP: HTTP
      }
    },
    mounted () {
      function err (e) {
        this.errors.push(e)
      }

      function success (response) {
        this.experimentSessionList = response.data
      }
      HTTP.get('/server/export/sessions/list').then(success.bind(this)).catch(err.bind(this))
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
