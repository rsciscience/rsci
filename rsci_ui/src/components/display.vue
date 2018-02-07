<template>
  <div class="experiment">
    
    <div className='session'>
     
     </div>

    <div id="waiting" >
      <div>Waiting...</div>
    </div>
  
  </div>
</template>

<script>
export default {
  name: 'Admin',
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    client_experiment_init: function (data) {
      debugger
      this.expermentSession= data
      this.sessionRunning = true
      console.log('client_experiment_init')
    },
   

  },
  data () {
    return {
      expermentSession: {
      },
      sessionRunning: false
    }
  },
  mounted () {},
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

