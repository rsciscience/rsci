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
document.oncontextmenu=RightMouseDown;
  document.onmousedown = mouseDown; 

  function mouseDown(e) {
      if (e.which==3) {//righClick
      alert("Disabled - do whatever you like here..");
   }
}
function RightMouseDown() { return false;}
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
      this.session.$destroy()
      document.getElementById('session').innerHTML = '<div id=\'content\'></div>'
      this.SessionComponent = null
      this.session = null
      var sessionStyles = document.getElementById('sessionStyles')
      try {
        sessionStyles.innerHTML = ''
      } catch (error) {
        sessionStyles.styleSheet.cssText = ''
      }
      console.log('client_experment_stop', val)
    },
    heartbeat_check: function () {
      this.$socket.emit('heartbeat_response')
    }
  },
  data () {
    return {
      expermentSession: {
      },
      sessionRunning: false
    }
  },
  mounted () {
    this.$socket.emit('heartbeat_response')
  }
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

