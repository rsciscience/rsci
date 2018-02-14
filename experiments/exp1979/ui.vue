<template>
  <div class="job">
    <div class= "scene-container" v-if="jobRunning" v-bind:class="{flashing: isFlashing}">
     
      <div id="scene_1" sceneNumber="1" class = "scene" v-bind:class="{currentScene: showScene1}">
        <div class = "sceneLabel"> trial start scene </div>
        <button v-on:click="Scene1TrialStartNosepoke_onclick" class= "nosepokeLarge" v-bind:class="{nosepokeLargeOff: ITIOn}"></button>
        <div class= "nosepokeholescontainer">
          <button v-on:click="Scene1nosepokestim1_onclick" class="nosepoke nosepoke1"></button>
          <button v-on:click="Scene1nosepokestim2_onclick" class="nosepoke nosepoke2"></button>
          <button v-on:click="Scene1nosepokestim3_onclick" class="nosepoke nosepoke3"></button>
          <button v-on:click="Scene1nosepokestim4_onclick" class="nosepoke nosepoke4"></button>
          <button v-on:click="Scene1nosepokestim5_onclick" class="nosepoke nosepoke5"></button>
        </div>
      </div>
      <div id="scene_2"  sceneNumber="2" class = "scene" v-bind:class="{currentScene: showScene2}" >
          <div class = "sceneLabel"> stimulus presentation scene </div>
          <button class= "nosepokeLarge nosepokeLargeOff Scene2PerseverativeTrialStartNosepoke"></button>
          <div class= "nosepokeholescontainer">
            <button v-on:click="Scene2nosepokestim1_onclick" class="nosepoke nosepoke1" v-bind:class="{nosepokeActive: nosepokeStimulus_1}" ></button>
            <button v-on:click="Scene2nosepokestim2_onclick" class="nosepoke nosepoke2" v-bind:class="{nosepokeActive: nosepokeStimulus_2}" ></button>
            <button v-on:click="Scene2nosepokestim3_onclick" class="nosepoke nosepoke3" v-bind:class="{nosepokeActive: nosepokeStimulus_3}" ></button>
            <button v-on:click="Scene2nosepokestim4_onclick" class="nosepoke nosepoke4" v-bind:class="{nosepokeActive: nosepokeStimulus_4}" ></button>
            <button v-on:click="Scene2nosepokestim5_onclick" class="nosepoke nosepoke5" v-bind:class="{nosepokeActive: nosepokeStimulus_5}" ></button>
          </div>
      </div>
    <div id="scene_3" class = "scene" v-bind:class="{currentScene: showScene3}" >
          <div class = "sceneLabel"> win outcome scene</div>
          <button class= "nosepokeLarge nosepokeLargeOff Scene3PerseverativeTrialStartNosepoke"></button>
        
        <div class= "nosepokeholescontainer">
          <button v-on:click="Scene3nosepokestim1_onclick" class="nosepoke nosepoke1"></button>
          <button v-on:click="Scene3nosepokestim2_onclick" class="nosepoke nosepoke2"></button>
          <button v-on:click="Scene3nosepokestim3_onclick" class="nosepoke nosepoke3"></button>
          <button v-on:click="Scene3nosepokestim4_onclick" class="nosepoke nosepoke4"></button>
          <button v-on:click="Scene3nosepokestim5_onclick" class="nosepoke nosepoke5"></button>
        </div>
    </div>
    <div id="scene_4"  class = "scene" v-bind:class="{currentScene: showScene4}" >
         <div class = "aversiveLight"></div>
          <button class= "nosepokeLarge nosepokeLargeOff Scene4PerseverativeTrialStartNosepoke"></button>
       
        <div class= "nosepokeholescontainer">
          <button v-on:click="Scene4nosepokestim1_onclick" class="nosepoke nosepoke1"></button>
          <button v-on:click="Scene4nosepokestim2_onclick" class="nosepoke nosepoke2"></button>
          <button v-on:click="Scene4nosepokestim3_onclick" class="nosepoke nosepoke3"></button>
          <button v-on:click="Scene4nosepokestim4_onclick" class="nosepoke nosepoke4"></button>
          <button v-on:click="Scene4nosepokestim5_onclick" class="nosepoke nosepoke5"></button>
        </div>
    </div>

      <div id="scene_5"  class = "scene" v-bind:class="{currentScene: showScene5}" >
    </div>
    </div>
    <div id="scene_noJob" v-else class="scene">
      <div>1979 Waiting...</div>
    </div>
  
  </div>
</template>

<script>
export default {
  name: '1979',
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    client_experiment_start: function (val) {
      this.job = val
      this.jobRunning = true
      console.log('client_experiment_start')
    },
    client_experment_stop: function (val) {
      this.job = val
      this.jobRunning = false
      console.log('client_experment_stop', val)
    },
    client_experment_action: function (action) {
      console.log('client_experment_action', action)
      if (action.type === 'changeToScene1') {
        this.currentScene = 1
        this.showScene1 = true
        this.showScene2 = false
        this.showScene3 = false
        this.showScene4 = false
        this.showScene5 = false
        this.ITIOn = false
      }
      if (action.type === 'changeToScene2') {
        this.currentScene = 2
        this.showScene1 = false
        this.showScene2 = true
        this.showScene3 = false
        this.showScene4 = false
        this.showScene5 = false
      }
      if (action.type === 'changeToScene3') {
        this.currentScene = 3
        this.showScene1 = false
        this.showScene2 = false
        this.showScene3 = true
        this.showScene4 = false
        this.showScene5 = false
      }
      if (action.type === 'changeToScene4') {
        this.currentScene = 4
        this.showScene1 = false
        this.showScene2 = false
        this.showScene3 = false
        this.showScene4 = true
        this.showScene5 = false
      }
      if (action.type === 'changeToScene5') {
        this.currentScene = 5
        this.showScene1 = false
        this.showScene2 = false
        this.showScene3 = false
        this.showScene4 = false
        this.showScene5 = true
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
      if (action.type === 'ITIOn') {
        this.ITIOn = true
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
      showScene5: false,
      nosepokeStimulus_1: false,
      nosepokeStimulus_2: false,
      nosepokeStimulus_3: false,
      nosepokeStimulus_4: false,
      nosepokeStimulus_5: false,
      ITIOn: false
    }
  },
  mounted () {},
  methods: {
    btnRedOnClick: function () {
      console.log('Btn Red Clicked!')
      this.$socket.emit('client_onevent', { type: 'btn_red_onClick' })
    },
    Scene1TrialStartNosepoke_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'Scene1TrialStartNosepoke_onclick' })
    },
    Scene1nosepokestim1_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'prematureResponse1' })
    },
    Scene1nosepokestim2_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'prematureResponse2' })
    },
    Scene1nosepokestim3_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'prematureResponse3' })
    },
    Scene1nosepokestim4_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'prematureResponse4' })
    },
    Scene1nosepokestim5_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'prematureResponse5' })
    },
    Scene2nosepokestim1_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'Scene2nosepokestim1_onclick' })
    },
    Scene2nosepokestim2_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'Scene2nosepokestim2_onclick' })
    },
    Scene2nosepokestim3_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'Scene2nosepokestim3_onclick' })
    },
    Scene2nosepokestim4_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'Scene2nosepokestim4_onclick' })
    },
    Scene2nosepokestim5_onclick: function () {
      this.$socket.emit('client_onevent', { type: 'Scene2nosepokestim5_onclick' })
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
  float: left;
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
  overflow: hidden;
  display: none;
}
.sceneLabel {
  position: relative;
  top: 0;
  left: 0;
}
.currentScene {
  display: block;
}
.aversiveLight{
  width: 200px;
	height: 200px;
	-moz-border-radius: 100px;
	-webkit-border-radius: 100px;
	border-radius: 100px;
  position: absolute;
  top: 50px;
  left: 50px; 
  background-color:white; 
}

.nosepoke {
  height: 100px;
  width: 100px;
  background-color: rgb(153, 153, 155);
  margin-left: 47px;
}
.nosepokeActive {
  background-color: yellow;
}

.nosepokeholescontainer {
  border: 1px rgb(153, 153, 155);
  position: absolute;
  top: 350px;
}
.nosepokeLarge {
  height: 150px;
  width: 150px;
  margin-left: 325px;
  background-color: yellow;
  position: absolute;
  top: 90px;
 
}
.nosepokeLargeOff {
  background-color: rgb(153,153,155); 
}

.flashing {
  background-color: white;
}
</style>

