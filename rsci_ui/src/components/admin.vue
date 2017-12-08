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
      <li v-for="item in jobs">
        {{ item.ip }}
      </li>
    </ul>


  </div>
</template>

<script>
import {HTTP} from '../http-common'

export default {
  name: 'Admin',
  data () {
    return {
      id: '',
      discoveryList: [],
      jobs: []
    }
  },
  mounted () {
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
