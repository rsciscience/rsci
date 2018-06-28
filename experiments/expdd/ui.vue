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
      }

      if (action.type.startsWith("NosePokeStimulus_on_")) {
        Vue.set(this, 'poke' + action.type.substring(action.type.length - 1, action.type.length), true)
        // this.nosePokeStimulusValues[ 'poke' + action.type.substring(action.type.length - 1, action.type.length)] = true;
      } 
      if (action.type.startsWith("NosePokeStimulus_off_")) {
        this.nosePokeStimulusValues[ 'poke' + action.type.substring(action.type.length - 1, action.type.length)] = false;
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
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
    },

    getCurrentScene: function(scene) {
      var output = [];
      if (this.currentScene === scene) {
        output.push('current-scene');
      }
    return output;
    },
    isNosePokeActive: function(nosePokeID) {
      debugger
      var output = [];
      if (this['poke' + nosePokeID] === true) {
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

