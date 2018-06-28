<template>
  <div class="session">
    
    <div class= "scene-container"  >
      <div id="scene_start" class = "scene" v-bind:class="getCurrentScene('start')" >
        <div class = "sceneLabel"> trial start scene </div>
        <button v-on:click="startTrial_onclick" class= "nosepokeLarge"></button>
      </div>
      <div id="scene_task"  class = "scene" v-bind:class="getCurrentScene('task')" >
          <div class = "sceneLabel"> stimulus presentation scene </div>
          <div class= "nosepokeholescontainer">
            <button v-on:click="nosepoke1_onclick" class="nose-poke nosepoke1" v-bind:class="isNosePokeActive('1')"  ></button>
            <button v-on:click="nosepoke2_onclick" class="nose-poke nosepoke2" v-bind:class="isNosePokeActive('2')"  ></button>
            <button v-on:click="nosepoke3_onclick" class="nose-poke nosepoke3" v-bind:class="isNosePokeActive('3')"  ></button>
            <button v-on:click="nosepoke4_onclick" class="nose-poke nosepoke4" v-bind:class="isNosePokeActive('4')"  ></button>
          </div>
      </div>
      <div id="scene_win" class = "scene"  v-bind:class="getCurrentScene('win')" >
          <div class = "sceneLabel"> win outcome scene</div>
      </div>
      <div id="scene_lose"  class = "scene" v-bind:class="getCurrentScene('lose')" > 
          <div class = "sceneLabel"> lose outcome scene</div>
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
        return ;
      } 
      if (action.type.startsWith("NosePokeStimulus_")) {
        var val = (action.type.startsWith("NosePokeStimulus_on"));
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
      ruunning: false,
      currentScene: '',
      isShowSceen_start: false,
      nosePokeStimulusValues: {}
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

    startTrial_onclick: function() { this.event("startTrial_pressed"); },
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
  /* You could think of as "step 1" */
  0% {
    background: white;
  }
  /* You could think of as "step 2" */
  100% {
    background: green;
  }
}

#scene_lose {
  background-color:white;
  animation: color-me-in 1s;
}

.nose-poke {
  height: 100px;
  width: 100px;
  margin-left: 65px;
  background-color: white;
}

.nose-poke-active {
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
  animation-iteration-count: infinite;
  animation: color-me-in 10s;
  position: absolute;
  top: 90px;
}


</style>

