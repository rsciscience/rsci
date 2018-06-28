<template>
  <div class="session">
    
    <div class= "scene-container"  v-bind:class="{flashing: isFlashing}">
      <div id="scene_start"  class = "scene" v-bind:class="getCurrentScene('start')">
        <div class = "sceneLabel"> trial start scene </div>
        <button v-on:click="Scene1TrialStartNosepoke_onclick" class= "nosepokeLarge" v-bind:class="{nosepokeLargeOff: ITIOn}"></button>
        <div class= "nosepokeholescontainer">
          <button v-on:click="Scene1nosepokestim1_onclick" class="nose-poke nosepoke1"></button>
          <button v-on:click="Scene1nosepokestim2_onclick" class="nose-poke nosepoke2"></button>
          <button v-on:click="Scene1nosepokestim3_onclick" class="nose-poke nosepoke3"></button>
          <button v-on:click="Scene1nosepokestim4_onclick" class="nose-poke nosepoke4"></button>
          <button v-on:click="Scene1nosepokestim5_onclick" class="nose-poke nosepoke5"></button>
        </div>
      </div>
      <div id="scene_2"   class = "scene" v-bind:class="getCurrentScene('2')">
          <div class = "sceneLabel"> stimulus presentation scene </div>
          <button class= "nosepokeLarge nosepokeLargeOff Scene2PerseverativeTrialStartNosepoke"></button>
          <div class= "nosepokeholescontainer">
            <button v-on:click="Scene2nosepokestim1_onclick" class="nose-poke nosepoke1" v-bind:class="isNosePokeActive('1')"  ></button>
            <button v-on:click="Scene2nosepokestim2_onclick" class="nose-poke nosepoke2" v-bind:class="isNosePokeActive('2')"  ></button>
            <button v-on:click="Scene2nosepokestim3_onclick" class="nose-poke nosepoke3" v-bind:class="isNosePokeActive('3')"  ></button>
            <button v-on:click="Scene2nosepokestim4_onclick" class="nose-poke nosepoke4" v-bind:class="isNosePokeActive('4')"  ></button>
            <button v-on:click="Scene2nosepokestim5_onclick" class="nose-poke nosepoke5" v-bind:class="isNosePokeActive('5')"  ></button>
          </div>
      </div>
      <div id="scene_3" class = "scene" v-bind:class="getCurrentScene('3')" >
          <div class = "sceneLabel"> win outcome scene</div>
          <button class= "nosepokeLarge nosepokeLargeOff Scene3PerseverativeTrialStartNosepoke"></button>
          
          <div class= "nosepokeholescontainer">
            <button class="nose-poke nosepoke1"></button>
            <button class="nose-poke nosepoke2"></button>
            <button class="nose-poke nosepoke3"></button>
            <button class="nose-poke nosepoke4"></button>
            <button class="nose-poke nosepoke5"></button>
          </div>
      </div>
      <div id="scene_4"  class = "scene" v-bind:class="getCurrentScene('4')" >
          <div class = "aversiveLight"></div>
            <button class= "nosepokeLarge nosepokeLargeOff Scene4PerseverativeTrialStartNosepoke"></button>
        
          <div class= "nosepokeholescontainer">
            <button class="nose-poke nosepoke1"></button>
            <button class="nose-poke nosepoke2"></button>
            <button class="nose-poke nosepoke3"></button>
            <button class="nose-poke nosepoke4"></button>
            <button class="nose-poke nosepoke5"></button>
          </div>
      </div>

      <div id="scene_5"  class = "scene" v-bind:class="getCurrentScene('5')" > </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "exp5Choice",
  sockets: {
    connect: function() {
      console.log("session socket connected");
    },

    client_experiment_session_start: function(val) {
      this.config = val;
      this.running = true;
      console.log("client_experiment_session_start");
    },

    client_experiment_session_stop: function(val) {
      this.running = false;
      console.log("client_experiment_session_stop");
    },

    client_experiment_action: function(action) {
      console.log("client_experment_action", action);

      const sceneActionMarker  = "ChangeToScene_" ; 
      if (action.type.startsWith(sceneActionMarker)) {
        var sceneName = action.type.substring(sceneActionMarker.length, action.type.length)
        this.currentScene = sceneName;
      }

      if (action.type.startsWith("NosePokeStimulus_off_all")) {
        const d = Object.assign({}, this.nosePokeStimulusValues); 
        for(var propertyName in d) {
          d[propertyName] = false;
        }
        this.nosePokeStimulusValues = d ;
        return ;
      }

      if (action.type.startsWith("NosePokeStimulus_")) {
        var val = (action.type.startsWith("NosePokeStimulus_on"));
        const d = Object.assign({}, this.nosePokeStimulusValues); 
        d['poke' + action.type.substring(action.type.length - 1, action.type.length)]= val ;
        this.nosePokeStimulusValues = d ;
      } 

      if (action.type === "ITIOn") {
        this.ITIOn = true;
      }
    }
  },
  data() {
    return {
      config: {
        id: "Placeholder"
      },
      running:  false,
      currentScene: '',
      isFlashing: false,
      nosePokeStimulusValues: {},
      ITIOn: false
    };
  },
  mounted() {
    console.log("mounted");
    this.$socket.emit("client_experiment_onevent", { type: "UI_onReady" });
  },
  methods: {
    event: function(actionType) {
      this.$socket.emit("client_experiment_onevent", { type: actionType });
    },
     getCurrentScene: function(scene) {
      var output = [];
      if (this.currentScene === scene) {
        output.push('current-scene');
      }
    return output;
    },
   isNosePokeActive: function(nosePokeID) {
      var output = [];
      if (this.nosePokeStimulusValues['poke' + nosePokeID] === true) {
        output.push('nose-poke-active');
      }
      return output;
    },
   beep: function () {
      var context = new AudioContext()
      var o = null
      var g = null
      o = context.createOscillator()
      o.type = "sine"
      o.connect(context.destination)
      o.start()
      setInterval(function(){o.stop(),500})
    },
    Scene1TrialStartNosepoke_onclick: function() { this.event("Scene1TrialStartNosepoke_onclick"); },
    Scene1nosepokestim1_onclick: function() { this.event("PrematureResponse1"); },
    Scene1nosepokestim2_onclick: function() { this.event("PrematureResponse2"); },
    Scene1nosepokestim3_onclick: function() { this.event("PrematureResponse3"); },
    Scene1nosepokestim4_onclick: function() { this.event("PrematureResponse4"); },
    Scene1nosepokestim5_onclick: function() { this.event("PrematureResponse5"); },
    Scene2nosepokestim1_onclick: function() { this.event("Scene2nosepokestim1_onclick"); },
    Scene2nosepokestim2_onclick: function() { this.event("Scene2nosepokestim2_onclick"); },
    Scene2nosepokestim3_onclick: function() { this.event("Scene2nosepokestim3_onclick"); },
    Scene2nosepokestim4_onclick: function() { this.event("Scene2nosepokestim4_onclick"); },
    Scene2nosepokestim5_onclick: function() { this.event("Scene2nosepokestim5_onclick"); }
  }
};
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
.current-scene {
  display: block;
}
.aversiveLight {
  width: 200px;
  height: 200px;
  -moz-border-radius: 100px;
  -webkit-border-radius: 100px;
  border-radius: 100px;
  position: absolute;
  top: 50px;
  left: 50px;
  background-color: white;
}

@keyframes color-me-in {
  0% { background: blue; }
  100% { background: gree; }
   }

.nose-poke {
  height: 100px;
  width: 100px;
  margin-left: 47px;
  background-color: white;
}
.nose-poke-active {
  background-color: yellow;
  animation-iteration-count: infinite;
  animation: color-me-in 1;
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
  background-color: rgb(153, 153, 155);
}
.flashing {
  background-color: white;
}
</style>

