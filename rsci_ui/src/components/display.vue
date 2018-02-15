<template>
  <div class="experiment">
    
    <div id='session'> </div>

    <div id="waiting" v-if="!sessionRunning" >
      <div>Waiting...</div>
    </div>

 <style id = 'sessionStyles'></style>

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
      var config = eval(data.ui.script).default
      config.template = data.ui 

      var styles = data.styles;
      var sessionStyles = document.getElementById('sessionStyles')

      try{sessionStyles.innerHTML = styles;}
      //IE fix
      catch(error){sessionStyles.styleSheet.cssText = styles;}

      console.log(data.ui)
      var MyComponent = Vue.extend(config)
      this.session = new MyComponent({data: config.data()}).$mount('#session')
      console.log('client_experiment_init')
      debugger
    },
    client_experment_stop: function (val) {
      this.job = val
      this.jobRunning = false
      console.log('client_experment_stop', val)
    },
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

