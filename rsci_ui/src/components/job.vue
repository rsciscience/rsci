<template>
  <div class="job">
    <div>Job {{ job.id }}</div>

    <div id="scene_1" v-if="jobRunning" v-bind:class="{flashing: isFlashing}"  class="scene">

      <button v-on:click="btnBlueOnClick" class="rat-btn btn-blue"></button>
      <button v-on:click="btnRedOnClick" class="rat-btn btn-red"></button>

    </div>

    <div id="scene_noJob" v-else class="scene">
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
    client_job_start: function (val) {
      this.job = val
      this.jobRunning = true
      console.log('client_job_start')
    },
    client_job_stop: function (val) {
      this.job = val
      this.jobRunning = false
      console.log('client_job_stop', val)
    },
    client_job_action: function (action) {
      console.log('client_job_action')
      this.isFlashing = true
      setTimeout(() => {
        this.isFlashing = !this.isFlashing
        setTimeout(() => {
          this.isFlashing = !this.isFlashing
          setTimeout(() => {
            this.isFlashing = !this.isFlashing
          }, 100)
        }, 100)
      }, 100)
    }
  },
  data () {
    return {
      job: {
        id: 'No Job'

      },
      jobRunning: false,
      isFlashing: false
    }
  },
  mounted () {

  },
  methods: {
    btnRedOnClick: function () {
      console.log('Btn Red Clicked!')
      this.$socket.emit('client_job_onevent', {type: 'btn_red_onClick'})
    },
    btnBlueOnClick: function () {
      console.log('Btn Blue Clicked!')
      this.$socket.emit('client_job_onevent', {type: 'btn_blue_onClick'})
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
  margin: 0 10px;
}
a {
  color: #42b983;
}
.job {
  color: white;
  height: 100vh;
  width: 100%;
  background-color: black;
}
.scene {
  height: 100%;
  width: 100%;;
  background-color: black;
}
.rat-btn {
  height: 200px;
  width: 200px;
}
.btn-blue {
  background-color: blue;
}
.btn-red {
  background-color: red;
}
.flashing {
  background-color: white;
}
</style>

