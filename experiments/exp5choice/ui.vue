<template>
  <div class="session">
    
    <div class= "scene-container"  >

      <div id="scene_start"  class = "scene" v-bind:class="getCurrentScene('start')">
        <div class = "sceneLabel">trial start scene</div>
        <button v-on:click="scene_startokestart_onclick" class= "nosepokeLarge" ></button>
        <div class= "nosepokeholescontainer">
          <button class="nose-poke nosepoke1"></button>
          <button class="nose-poke nosepoke2"></button>
          <button class="nose-poke nosepoke3"></button>
          <button class="nose-poke nosepoke4"></button>
          <button class="nose-poke nosepoke5"></button>
        </div>
      </div>

      <div id="scene_stimulas"  class = "scene" v-bind:class="getCurrentScene('stimulas')">
        <div class = "sceneLabel">decision scene</div>
          <button class= "nosepokeLarge nosepokeLargeOff "></button>
          <div class= "nosepokeholescontainer">
            <button v-on:click="scene_stimulas1_onclick" class="nose-poke nosepoke1" v-bind:class="isNosePokeActive('1')"  ></button>
            <button v-on:click="scene_stimulas2_onclick" class="nose-poke nosepoke2" v-bind:class="isNosePokeActive('2')"  ></button>
            <button v-on:click="scene_stimulas3_onclick" class="nose-poke nosepoke3" v-bind:class="isNosePokeActive('3')"  ></button>
            <button v-on:click="scene_stimulas4_onclick" class="nose-poke nosepoke4" v-bind:class="isNosePokeActive('4')"  ></button>
            <button v-on:click="scene_stimulas5_onclick" class="nose-poke nosepoke5" v-bind:class="isNosePokeActive('5')"  ></button>
          </div>
      </div>

      <div id="scene_premature"   class = "scene" v-bind:class="getCurrentScene('premature')">
          <div class = "sceneLabel">premature scene</div>
          <button class= "nosepokeLarge nosepokeLargeOff "></button>
          <div class= "nosepokeholescontainer">
            <button v-on:click="scene_premature1_onclick" class="nose-poke nosepoke1" v-bind:class="isNosePokeActive('1')"  ></button>
            <button v-on:click="scene_premature2_onclick" class="nose-poke nosepoke2" v-bind:class="isNosePokeActive('2')"  ></button>
            <button v-on:click="scene_premature3_onclick" class="nose-poke nosepoke3" v-bind:class="isNosePokeActive('3')"  ></button>
            <button v-on:click="scene_premature4_onclick" class="nose-poke nosepoke4" v-bind:class="isNosePokeActive('4')"  ></button>
            <button v-on:click="scene_premature5_onclick" class="nose-poke nosepoke5" v-bind:class="isNosePokeActive('5')"  ></button>
          </div>
      </div>
      
      <div id="scene_incorect"  class = "scene scene-incorrect" v-bind:class="getCurrentScene('incorect')" >
          <div class = "sceneLabel"> incorrcet scene </div>
          <div class = "aversiveLight" v-bind:class="{flashing: isFlashing}" ></div>
            <button class= "nosepokeLarge nosepokeLargeOff "></button>
        
          <div class= "nosepokeholescontainer">
            <button class="nose-poke nosepoke1"></button>
            <button class="nose-poke nosepoke2"></button>
            <button class="nose-poke nosepoke3"></button>
            <button class="nose-poke nosepoke4"></button>
            <button class="nose-poke nosepoke5"></button>
          </div>
      </div>
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
        return;
      }

      if (action.type.startsWith("NosePokeStimulus_off_all")) {
        const d = Object.assign({}, this.nosePokeStimulusValues); 
        for(var propertyName in d) {
          d[propertyName] = false;
        }
        this.nosePokeStimulusValues = d ;
        return;
      }

      if (action.type.startsWith("NosePokeStimulus_")) {
        var val = (action.type.startsWith("NosePokeStimulus_on"));
        const d = Object.assign({}, this.nosePokeStimulusValues); 
        d['poke' + action.type.substring(action.type.length - 1, action.type.length)]= val ;
        this.nosePokeStimulusValues = d ;
        return;
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
      if (this.currentScene.toLowerCase() === scene.toLowerCase()) {
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
    scene_startokestart_onclick: function() { this.event("Pokestart"); },
    scene_premature1_onclick: function() { this.event("PrematureResponse1"); },
    scene_premature2_onclick: function() { this.event("PrematureResponse2"); },
    scene_premature3_onclick: function() { this.event("PrematureResponse3"); },
    scene_premature4_onclick: function() { this.event("PrematureResponse4"); },
    scene_premature5_onclick: function() { this.event("PrematureResponse5"); },
    scene_stimulas1_onclick: function() { this.event("Poke1"); },
    scene_stimulas2_onclick: function() { this.event("Poke2"); },
    scene_stimulas3_onclick: function() { this.event("Poke3"); },
    scene_stimulas4_onclick: function() { this.event("Poke4"); },
    scene_stimulas5_onclick: function() { this.event("Poke5"); }
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
.scene-incorrect{
  background-color: rgb(255, 255, 255);
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
  background-color: green; 
}

@keyframes color-me-in {
  0% { background: blue; }
  100% { background: green; }
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

