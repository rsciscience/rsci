<template>
  <div class="session">
    
    <div class= "scene-container"  v-bind:class="{flashing: isFlashing}">
      <div id="scene_1" sceneNumber="1" class = "scene" v-bind:class="{currentScene: showScene1}">
        <h1> hello fergs exp  </h1>
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
            <button v-on:click="Scene2nosepokestim1_onclick" class="nosepoke nosepoke1" v-bind:class="{nosepokeActive: NosePokeStimulus}" ></button>
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

      <div id="scene_5"  class = "scene" v-bind:class="{currentScene: showScene5}" > </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'exp1979',
  sockets: {
    connect: function () {
      console.log('session socket connected')
    },

    client_experiment_session_start: function (val) {
      this.job = val
      this.jobRunning = true
      console.log('client_experiment_session_start')
    },
    client_experiment_session_stop: function (val) {
      this.jobRunning = false
      console.log('client_experiment_session_stop')
    },

    client_experiment_action: function (action) {
      console.log('client_experment_action', action)
    
    if (action.type.startsWith('ChangeToScene')){
      this.showScene1 = false
      this.showScene2 = false
      this.showScene3 = false
      this.showScene4 = false
      this.showScene5 = false
   
      switch(action.type){
        case 'ChangeToScene1':
          this.currentScene = 1
          this.showScene1 = true
          this.ITIOn = false
        break;
        case 'ChangeToScene2': 
          this.currentScene = 2
          this.showScene2 = true
        break;
        case 'ChangeToScene3':  
          this.currentScene = 3
          this.showScene3 = true
        break;
        case 'ChangeToScene4': 
          this.currentScene = 4
          this.showScene4 = true
        break;
        case 'ChangeToScene5': 
          this.currentScene = 5
          this.showScene5 = true
        break;
      }
    }
      
    if (action.type.startsWith('nosepokeStimulus_')){
      this.NosePokeStimulus = false
      this.nosepokeStimulus_2 = false
      this.nosepokeStimulus_3 = false
      this.nosepokeStimulus_4 = false
      this.nosepokeStimulus_5 = false
      switch(action.type){
        case 'NosePokeStimulus' : this.NosePokeStimulus = true; break;
        case 'nosepokeStimulus_2' : this.nosepokeStimulus_2 = true; break;
        case 'nosepokeStimulus_3' : this.nosepokeStimulus_3 = true; break;
        case 'nosepokeStimulus_4' : this.nosepokeStimulus_4 = true; break;
        case 'nosepokeStimulus_5' : this.nosepokeStimulus_5 = true; break;
      }
    }

    if (action.type === 'ITIOn') {
        this.ITIOn = true
      }
    }
  },
  data () {
    return {
      job: {
        id: 'No Job'
      },
      isFlashing: false,
      currentScene: 0,
      showScene1: false,
      showScene2: false,
      showScene3: false,
      showScene4: false,
      showScene5: false,
      NosePokeStimulus: false,
      nosepokeStimulus_2: false,
      nosepokeStimulus_3: false,
      nosepokeStimulus_4: false,
      nosepokeStimulus_5: false,
      ITIOn: false
    }
  },
  mounted () {
    console.log('mounted')
    this.$socket.emit('client_experiment_onevent', { type: 'UI_onReady' })
  },
  methods: {
    event: function (actionType) {
        this.$socket.emit('client_experiment_onevent', { type: actionType})
    },
    
    Scene1TrialStartNosepoke_onclick: function () { this.event('Scene1TrialStartNosepoke_onclick') },
    Scene1nosepokestim1_onclick: function () { this.event('prematureResponse2') },
    Scene1nosepokestim2_onclick: function () { this.event('prematureResponse2') },
    Scene1nosepokestim3_onclick: function () { this.event('prematureResponse3') },
    Scene1nosepokestim4_onclick: function () { this.event('prematureResponse4') },
    Scene1nosepokestim5_onclick: function () { this.event('prematureResponse5') },
    Scene2nosepokestim1_onclick: function () { this.event('Scene2nosepokestim1_onclick') },
    Scene2nosepokestim2_onclick: function () { this.event('Scene2nosepokestim2_onclick') },
    Scene2nosepokestim3_onclick: function () { this.event('Scene2nosepokestim3_onclick') },
    Scene2nosepokestim4_onclick: function () { this.event('Scene2nosepokestim4_onclick') },
    Scene2nosepokestim5_onclick: function () { this.event('Scene2nosepokestim5_onclick') },
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
.session {
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
  border-radius: 50%;
  behavior: url(PIE.htc); /* remove if you don't care about IE8 */
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

