<template>
  <div class="admin">
    <h1>{{ msg }}</h1>
    <h2>Admin</h2>

  </div>
</template>

<script>
export default {
  name: 'Admin',
  data () {
    debugger
    axios.get('http://localhost:3003/client/state').then((response) => {
      console.log(response.data)
    })
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
