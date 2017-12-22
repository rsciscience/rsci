<template>
  <div class="job">
    <div>Job {{ job.id }}</div>
    <div class= "scene-container" v-if="jobRunning" v-bind:class="{flashing: isFlashing}">
     
      <div id="scene_1" class = "scene" >
        <h1> trial start scene </h1>
        <button v-on:click="Scene1TrialStart_onclick" class= "trialstart"></button>
        <div class= "nosepokeholes">
          <button v-on:click="Scene1nosepokestim1_onclick" class="nosepoke nosepoke1"></button>
          <button v-on:click="Scene1nosepokestim2_onclick" class="nosepoke nosepoke2"></button>
          <button v-on:click="Scene1nosepokestim3_onclick" class="nosepoke nosepoke3"></button>
          <button v-on:click="Scene1nosepokestim4_onclick" class="nosepoke nosepoke4"></button>
          <button v-on:click="Scene1nosepokestim5_onclick" class="nosepoke nosepoke5"></button>
        </div>
      </div>
      <div id="scene_2"  class = "scene" >
          <h1> stimulus presentation scene </h1>
          <button class= "trialstart"></button>
          <div class= "nosepokeholes">
            <button v-on:click="Scene2nosepokestim1_onclick" class="nosepoke nosepoke1"></button>
            <button v-on:click="Scene2nosepokestim2_onclick" class="nosepoke nosepoke2"></button>
            <button v-on:click="Scene2nosepokestim3_onclick" class="nosepoke nosepoke3"></button>
            <button v-on:click="Scene2nosepokestim4_onclick" class="nosepoke nosepoke4"></button>
            <button v-on:click="Scene2nosepokestim5_onclick" class="nosepoke nosepoke5"></button>
          </div>
      </div>
    <div id="scene_3" class = "scene" >
          <h1> win outcome scene</h1>
          <button class= "trialstart"></button>
        
        <div class= "nosepokeholes">
          <button v-on:click="Scene3nosepokestim1_onclick" class="nosepoke nosepoke1"></button>
          <button v-on:click="Scene3nosepokestim2_onclick" class="nosepoke nosepoke2"></button>
          <button v-on:click="Scene3nosepokestim3_onclick" class="nosepoke nosepoke3"></button>
          <button v-on:click="Scene3nosepokestim4_onclick" class="nosepoke nosepoke4"></button>
          <button v-on:click="Scene3nosepokestim5_onclick" class="nosepoke nosepoke5"></button>
        </div>
    </div>
    <div id="scene_4"  class = "scene" >
          <h1> incorrect aversive houselight scene </h1>
          <button class= "trialstart"></button>
       
        <div class= "nosepokeholes">
          <button v-on:click="nosepokestim1_onclick" class="nosepoke nosepoke1"></button>
          <button v-on:click="nosepokestim2_onclick" class="nosepoke nosepoke2"></button>
          <button v-on:click="nosepokestim3_onclick" class="nosepoke nosepoke3"></button>
          <button v-on:click="nosepokestim4_onclick" class="nosepoke nosepoke4"></button>
          <button v-on:click="nosepokestim5_onclick" class="nosepoke nosepoke5"></button>
        </div>
    </div>
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
  mounted () {},
  methods: {
    btnRedOnClick: function () {
      console.log('Btn Red Clicked!')
      this.$socket.emit('client_job_onevent', { type: 'btn_red_onClick' })
    },
    Scene1TrialStart_onclick: function () {
      console.log('Clicked!')
    },
    Scene1nosepokestim1_onclick: function () {
      console.log('Clicked!')
    },
    Scene1nosepokestim2_onclick: function () {
      console.log('Clicked!')
    },
    Scene1nosepokestim3_onclick: function () {
      console.log('Clicked!')
    },
    Scene1nosepokestim4_onclick: function () {
      console.log('Clicked!')
    },
    Scene1nosepokestim5_onclick: function () {
      console.log('Clicked!')
    },
    Scene2nosepokestim1_onclick: function () {
      console.log('Clicked!')
    },
    Scene2nosepokestim2_onclick: function () {
      console.log('Clicked!')
    },
    Scene2nosepokestim3_onclick: function () {
      console.log('Clicked!')
    },
    Scene2nosepokestim4_onclick: function () {
      console.log('Clicked!')
    },
    Scene2nosepokestim5_onclick: function () {
      console.log('Clicked!')
    },
    Scene3nosepokestim1_onclick: function () {
      console.log('Clicked!')
    },
    Scene3nosepokestim2_onclick: function () {
      console.log('Clicked!')
    },
    Scene3nosepokestim3_onclick: function () {
      console.log('Clicked!')
    },
    Scene3nosepokestim4_onclick: function () {
      console.log('Clicked!')
    },
    Scene3nosepokestim5_onclick: function () {
      console.log('Clicked!')
    },
    Scene4nosepokestim1_onclick: function () {
      console.log('Clicked!')
    },
    Scene4nosepokestim2_onclick: function () {
      console.log('Clicked!')
    },
    Scene4nosepokestim3_onclick: function () {
      console.log('Clicked!')
    },
    Scene4nosepokestim4_onclick: function () {
      console.log('Clicked!')
    },
    Scene4nosepokestim5_onclick: function () {
      console.log('Clicked!')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
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
.scene-container {
  height: 100%;
  width: 100%;
  background-color: black;
}
.scene {
  height: 480px;
  width: 800px;
  border: 1px solid red;
  overflow: hidden;
}
.nosepoke {
  height: 100px;
  width: 100px;
  background-color: rgb(153, 153, 155);
  margin-left: 45px;
}
.nosepokeholes {
  border: 1px rgb(153, 153, 155);
  margin-top: 95px;
}
.trialstart {
  height: 200px;
  width: 200px;
  background-color: solid gold;
  border: 1px solid red;
  margin-left: 315px;
  margin-top: 15px;
}
.btn-blue {
}
.btn-red {
  background-color: red;
}
.flashing {
  background-color: white;
}
</style>

