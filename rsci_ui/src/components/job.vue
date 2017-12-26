<template>
  <div class="job">
    <div>Job {{ job.id }}</div>
    <div class= "scene-container" v-if="jobRunning" v-bind:class="{flashing: isFlashing}">
     
      <div id="scene_1" sceneNumber="1" class = "scene" v-bind:class="{currentScene: showScene1}">
        <h1> trial start scene </h1>
        <button v-on:click="Scene1TrialStartNosepoke_onclick" class= "nosepokeLarge"></button>
        <div class= "nosepokeholescontainer">
          <button v-on:click="Scene1nosepokestim1_onclick" class="nosepoke nosepoke1"></button>
          <button v-on:click="Scene1nosepokestim2_onclick" class="nosepoke nosepoke2"></button>
          <button v-on:click="Scene1nosepokestim3_onclick" class="nosepoke nosepoke3"></button>
          <button v-on:click="Scene1nosepokestim4_onclick" class="nosepoke nosepoke4"></button>
          <button v-on:click="Scene1nosepokestim5_onclick" class="nosepoke nosepoke5"></button>
        </div>
      </div>
      <div id="scene_2"  sceneNumber="2" class = "scene" v-bind:class="{currentScene: showScene2}" >
          <h1> stimulus presentation scene </h1>
          <button class= "nosepokeLarge Scene2PerseverativeTrialStartNosepoke"></button>
          <div class= "nosepokeholescontainer">
            <button v-on:click="Scene2nosepokestim1_onclick" class="nosepoke nosepoke1" v-bind:class="{nosepokeActive: nosepokeStimulus_1}" ></button>
            <button v-on:click="Scene2nosepokestim2_onclick" class="nosepoke nosepoke2" v-bind:class="{nosepokeActive: nosepokeStimulus_2}" ></button>
            <button v-on:click="Scene2nosepokestim3_onclick" class="nosepoke nosepoke3" v-bind:class="{nosepokeActive: nosepokeStimulus_3}" ></button>
            <button v-on:click="Scene2nosepokestim4_onclick" class="nosepoke nosepoke4" v-bind:class="{nosepokeActive: nosepokeStimulus_4}" ></button>
            <button v-on:click="Scene2nosepokestim5_onclick" class="nosepoke nosepoke5" v-bind:class="{nosepokeActive: nosepokeStimulus_5}" ></button>
          </div>
      </div>
    <div id="scene_3" class = "scene" v-bind:class="{currentScene: showScene3}" >
          <h1> win outcome scene</h1>
          <button class= "nosepokeLarge Scene3PerseverativeTrialStartNosepoke"></button>
        
        <div class= "nosepokeholescontainer">
          <button v-on:click="Scene3nosepokestim1_onclick" class="nosepoke nosepoke1"></button>
          <button v-on:click="Scene3nosepokestim2_onclick" class="nosepoke nosepoke2"></button>
          <button v-on:click="Scene3nosepokestim3_onclick" class="nosepoke nosepoke3"></button>
          <button v-on:click="Scene3nosepokestim4_onclick" class="nosepoke nosepoke4"></button>
          <button v-on:click="Scene3nosepokestim5_onclick" class="nosepoke nosepoke5"></button>
        </div>
    </div>
    <div id="scene_4"  class = "scene scene4" v-bind:class="{currentScene: showScene4}" >
          <h1> incorrect aversive houselight scene </h1>
          <button class= "nosepokeLarge Scene4PerseverativeTrialStartNosepoke"></button>
       
        <div class= "nosepokeholescontainer">
          <button v-on:click="Scene4nosepokestim1_onclick" class="nosepoke nosepoke1"></button>
          <button v-on:click="Scene4nosepokestim2_onclick" class="nosepoke nosepoke2"></button>
          <button v-on:click="Scene4nosepokestim3_onclick" class="nosepoke nosepoke3"></button>
          <button v-on:click="Scene4nosepokestim4_onclick" class="nosepoke nosepoke4"></button>
          <button v-on:click="Scene4nosepokestim5_onclick" class="nosepoke nosepoke5"></button>
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
      console.log('client_job_action', action)
      if (action.type === 'changeToScene1') {
        this.currentScene = 1
        this.showScene1 = true
        this.showScene2 = false
        this.showScene3 = false
        this.showScene4 = false
      }
      if (action.type === 'changeToScene2') {
        this.currentScene = 2
        this.showScene1 = false
        this.showScene2 = true
        this.showScene3 = false
        this.showScene4 = false
      }
      if (action.type === 'changeToScene3') {
        this.currentScene = 3
        this.showScene1 = false
        this.showScene2 = false
        this.showScene3 = true
        this.showScene4 = false
      }
      if (action.type === 'changeToScene4') {
        this.currentScene = 4
        this.showScene1 = false
        this.showScene2 = false
        this.showScene3 = false
        this.showScene4 = true
      }
      if (action.type === 'nosepokeStimulus_1') {
        this.nosepokeStimulus_1 = true
        this.nosepokeStimulus_2 = false
        this.nosepokeStimulus_3 = false
        this.nosepokeStimulus_4 = false
        this.nosepokeStimulus_5 = false
      }
      if (action.type === 'nosepokeStimulus_2') {
        this.nosepokeStimulus_1 = false
        this.nosepokeStimulus_2 = true
        this.nosepokeStimulus_3 = false
        this.nosepokeStimulus_4 = false
        this.nosepokeStimulus_5 = false
      }
      if (action.type === 'nosepokeStimulus_3') {
        this.nosepokeStimulus_1 = false
        this.nosepokeStimulus_2 = false
        this.nosepokeStimulus_3 = true
        this.nosepokeStimulus_4 = false
        this.nosepokeStimulus_5 = false
      }
      if (action.type === 'nosepokeStimulus_4') {
        this.nosepokeStimulus_1 = false
        this.nosepokeStimulus_2 = false
        this.nosepokeStimulus_3 = false
        this.nosepokeStimulus_4 = true
        this.nosepokeStimulus_5 = false
      }
      if (action.type === 'nosepokeStimulus_5') {
        this.nosepokeStimulus_1 = false
        this.nosepokeStimulus_2 = false
        this.nosepokeStimulus_3 = false
        this.nosepokeStimulus_4 = false
        this.nosepokeStimulus_5 = true
      }
    }
  },
  data () {
    /* Jcomments
     * this part of the code defines the data that the UI uses to control different scenes and states such as colours, sizes, and positions
     */
    return {
      job: {
        id: 'No Job'
      },
      jobRunning: false,
      isFlashing: false,
      currentScene: 0,
      showScene1: false,
      showScene2: false,
      showScene3: false,
      showScene4: false,
      nosepokeStimulus_1: false,
      nosepokeStimulus_2: false,
      nosepokeStimulus_3: false,
      nosepokeStimulus_4: false,
      nosepokeStimulus_5: false
    }
  },
  mounted () {},
  methods: {
    btnRedOnClick: function () {
      console.log('Btn Red Clicked!')
      this.$socket.emit('client_job_onevent', { type: 'btn_red_onClick' })
    },
    Scene1TrialStartNosepoke_onclick: function () {
      this.$socket.emit('client_job_onevent', { type: 'Scene1TrialStartNosepoke_onclick' })
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
      this.$socket.emit('client_job_onevent', { type: 'Scene2nosepokestim1_onclick' })
    },
    Scene2nosepokestim2_onclick: function () {
      this.$socket.emit('client_job_onevent', { type: 'Scene2nosepokestim2_onclick' })
    },
    Scene2nosepokestim3_onclick: function () {
      this.$socket.emit('client_job_onevent', { type: 'Scene2nosepokestim3_onclick' })
    },
    Scene2nosepokestim4_onclick: function () {
      this.$socket.emit('client_job_onevent', { type: 'Scene2nosepokestim4_onclick' })
    },
    Scene2nosepokestim5_onclick: function () {
      this.$socket.emit('client_job_onevent', { type: 'Scene2nosepokestim5_onclick' })
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
  display: none;
}
.currentScene {
  display: block;
}
.scene4{
  background-color: red;
}

.nosepoke {
  height: 100px;
  width: 100px;
  background-color: rgb(153, 153, 155);
  margin-left: 45px;
}
.nosepokeActive {
  background-color: yellow;
}

.nosepokeholescontainer {
  border: 1px rgb(153, 153, 155);
  margin-top: 95px;
}
.nosepokeLarge {
  height: 200px;
  width: 200px;
  background-color: solid gold;
  border: 1px solid rgb(252, 251, 251);
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

