<template>
  <div class="experiment">
    
    <div id='session'> 
      <div id='content'> 
      
    </div> 
    </div>

    <div id="waiting" v-if="!sessionRunning" >
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
      console.log('Experiment Init')
      this.expermentSession = data
      this.sessionRunning = true
      // eslint-disable-next-line
      var config = eval(data.ui.script).default
      config.template = data.ui.template
      var styles = data.ui.styles
      var sessionStyles = document.getElementById('sessionStyles')

      try {
        sessionStyles.innerHTML = styles
      } catch (error) {
        sessionStyles.styleSheet.cssText = styles
      }

      console.log(data.ui)
      this.SessionComponent = Vue.extend(config)
      this.session = new this.SessionComponent().$mount('#content')
      console.log('client_experiment_init')
    },
    client_experiment_dispose: function (val) {
      console.log('Experiment Dispose')
      this.sessionRunning = false

      document.getElementById('content').innerHTML = ''
      this.SessionComponent = null
      this.session = null
      var sessionStyles = document.getElementById('sessionStyles')
      try {
        sessionStyles.innerHTML = ''
      } catch (error) {
        sessionStyles.styleSheet.cssText = ''
      }
      console.log('client_experment_stop', val)
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

