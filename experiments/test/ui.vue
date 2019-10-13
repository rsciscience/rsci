<template>
  <div class="session">
    
    <div class= "scene-container"  >
      
      <div id="scene_start" class = "scene" v-bind:class="getCurrentScene('start')" >
        <div class = "sceneLabel"> Start Scene </div>
          <div class= "nosepokeholescontainer">
            <button v-on:click="nosepoke1_onclick" class="nose-poke nosepoke1 nose-poke-highlight" v-bind:class="isNosePokeActive('1')"  >Food</button>
            <button v-on:click="nosepoke2_onclick" class="nose-poke nosepoke2 nose-poke-highlight" v-bind:class="isNosePokeActive('2')"  >Drug</button>
            <button v-on:click="nosepoke3_onclick" class="nose-poke nosepoke3 nose-poke-highlight" v-bind:class="isNosePokeActive('3')"  >Buzz</button>
          </div>
      </div>
  
    </div>
    
  </div>
</template>

<script>
export default {
  name: "expDD",
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
        return ;
      }

      if (action.type.startsWith("NosePokeStimulus_")) {
        var val = (action.type.startsWith("NosePokeStimulus_on"));
        const d = Object.assign({}, this.nosePokeStimulusValues); 
        d['poke' + action.type.substring(action.type.length - 1, action.type.length)]= val ;
        this.nosePokeStimulusValues = d ;
      } 

      if (action.type.startsWith("PulseNosePoke_")) {
        var val = (action.type.startsWith("PulseNosePoke_on"));
        const d = Object.assign({}, this.nosePokeStimulusValues); 
        d['poke' + action.type.substring(action.type.length - 1, action.type.length)]= val ;
        this.nosePokeStimulusValues = d ;
      } 
      
      if (action.type.startsWith('beep')) {
        this.beep();
      } 
    }
  },
  data() {
    return {
      config: {
        id: "Placeholder"
      },
      running: false,
      currentScene: '',
      nosePokeStimulusValues: {}
    };
  },
  mounted() {
    console.log("mounted");
    this.$socket.emit("client_experiment_onevent", { type: "UI_onReady" });
  },
  beforeDestroy(){
    delete this.$options.sockets.client_experiment_session_start;
    delete this.$options.sockets.client_experiment_session_stop;
    delete this.$options.sockets.client_experiment_action;
   
  },
  methods: {
    event: function(actionType) {
      this.$socket.emit("client_experiment_onevent", { type: actionType });
    },

    startTrial_onclick: function() { this.event("startTrial_pressed"); },

    nosepoke1Premature_onclick: function() { this.event("nosePoke1Premature_pressed"); },
    nosepoke2Premature_onclick: function() { this.event("nosePoke2Premature_pressed"); },
    nosepoke3Premature_onclick: function() { this.event("nosePoke3Premature_pressed"); },
    nosepoke4Premature_onclick: function() { this.event("nosePoke4Premature_pressed"); },

    nosepoke1_onclick: function() { this.event("nosePoke1_pressed"); },
    nosepoke2_onclick: function() { this.event("nosePoke2_pressed"); },
    nosepoke3_onclick: function() { this.event("nosePoke3_pressed"); },
    nosepoke4_onclick: function() { this.event("nosePoke4_pressed"); },

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
.current-scene {
  display: block;
}
#scene_win {
  background-color: black;
  
}

@keyframes color-me-in {
  0% { background: white; }
  10% { background: green; }
  20% { background: white; }
  30% { background: green; }
  40% { background: white; }
  50% { background: green; }
  60% { background: white; }
  70% { background: green; }
  80% { background: white; }
  90% { background: green; }
  100% { background: white; }
  
}

#scene_lose {
  background-color:white;
  animation: color-me-in 1s;
  animation-iteration-count: infinite;
}

.nose-poke {
  height: 100px;
  width: 100px;
  margin-left: 65px;
  background-color: rgb(214, 214, 214);
}

.nose-poke-highlight{
  background-color: yellow;
}

.nose-poke-active {
  background-color: rgb(166, 255, 0);
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
  animation-iteration-count: infinite;
  animation: color-me-in 10s;
  position: absolute;
  top: 90px;
}


</style>

