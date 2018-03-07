<template>
  <div class="export">
    <input v-model="experimentSessionId" placeholder="edit me" />
   <h2>Sessions</h2>
  </div>
</template>

<script>
  import {HTTP} from '../http-common'
  export default {
    name: 'client',
    data () {
      return {
        experimentSessionId: '10136576'
      }
    },
    mounted () {
      function err (e) {
        this.errors.push(e)
      }

      function success (response) {
        console.log(response)
      }
      HTTP.get('/server/experiment/' + this.experimentSessionId + '/export').then(success.bind(this)).catch(err.bind(this))
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
