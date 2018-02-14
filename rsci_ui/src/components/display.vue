<template>
  <div class="experiment">
    
    <div id='session'>
     </div>

    <div id="waiting" >
      <div>Waiting...</div>
    </div>
  
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'Admin',
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    client_experiment_init: function (data) {
      this.expermentSession = data
      this.sessionRunning = true
      

      console.log(data.ui)
      var MyComponent = Vue.extend(data.ui,{ 
        mixins: data.script,
      })

      var component = new MyComponent().$mount('#session')

      //console.log(component)
      console.log('client_experiment_init')
      debugger
    }
  },
  data () {
    return {
      expermentSession: {
      },
      sessionRunning: false
    }
  },
  mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.experiment {
  color: white;
  height: 100vh;
  width: 100%;
  background-color: black;
}

</style>

