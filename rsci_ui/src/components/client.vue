<template>
  <div class="client">
    <h1>Client : {{ me.id }}</h1>
    I'm here :)
      <div>
        connected to server  <a target="" :href="'http://' + server.ip + ':8080/#admin'" >{{ server.id }}</a>
      </div>
  </div>
</template>

<script>
  import {HTTP} from '../http-common'
  export default {
    name: 'client',
    data () {
      return {
        me: '',
        server: {}
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
      }

      HTTP.get('client/state').then(success.bind(this)).catch(err.bind(this))
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
