<template>
  <div class="experiments">
    <h2>Available Experiments</h2>

     <div class="row">
      <div class="col-sm-2">
        <ul class="experimentslist">
          <li v-for="item in experimentsList" v-bind:key="item.name" >
            <span class="avaibleExperiment" v-on:click="selectExperiment(item)"> {{item.name}} </span>
          </li>
        </ul>
      </div>
      <div class="col-sm-10">
        <div v-if="hasCurrentExperiment">
         <table>
           <tr>
             <td>
              <h3>{{currentExperiment.name}}</h3>
              <div><label>Session Id:</label>         <input v-model="currentExperiment.sessionVariables.experimentSessionId" placeholder="edit me">  </div>
             
              <div><label>Duration:</label>         <input v-model="currentExperiment.sessionVariables.duration" placeholder="edit me">  </div>
              <div><label>TimeOut Duration:</label> <input v-model="currentExperiment.sessionVariables.timeOutDuration" placeholder="edit me">  </div>


        <div  v-for=”property in currentExperiment.sessionVariables>
           {{property.name}}
           {{property}}
           {{property.value}}
        </div>

             </td>
             <td>
                  <button  class = "btn btn-start-exp"  v-on:click="startExperiment()">Start</button>
             </td>
           </tr>
         </table>

          <p />

           <clientPicker v-bind:initialConfig="initialConfig"></clientPicker>

        </div>
      </div>
    </div>

  </div>

</template>

<script>
import {HTTP} from '../http-common'

export default {
  name: 'experiments',
  props: {
    experimentsList: {
      default: function () { return [] },
      type: Array
    }
  },
  data () {
    return {
      currentExperiment: {
        sessionVariables: {},
        clientAssignments: []
      },
      hasCurrentExperiment: false,
      initialConfig: []
    }
  },
  methods: {
    isActive: function (client) {
      return client.active
    },
    selectExperiment (item) {
      this.currentExperiment = item
      this.hasCurrentExperiment = true
      this.getExperimentInitialConfig()
    },
    getExperimentInitialConfig () {
      var config = this.currentExperiment
      function err (e) {
        this.errors.push(e)
      }
      function success (response) {
        this.initialConfig = response.data

        console.log('Got Experiment Initial Config!')
        console.log(response)
      }
      HTTP.get('server/experiment/' + config.id + '/initialConfig', config).then(success.bind(this)).catch(err.bind(this))
    },
    startExperiment: function () {
      var config = { ...this.currentExperiment, clients: [] }

      config.clientAssignments = null

      for (var i = 0; i < this.initialConfig.length; i++) {
        var client = this.initialConfig[i]

        if (client.isIncludedInSession && client.isOnline) {
          config.clients.push(client)
        }
      }
      function err (e) {
        this.errors.push(e)
      }
      function success (response) {
        console.log('Experiment Started!')
      }
      HTTP.post('server/experiment/' + config.id + '/start', config).then(success.bind(this)).catch(err.bind(this))
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}

label{
  width :150px
  }

.experimentsList{
}
.experimentsList span:hover{
  color: blue;
}
.client{
    display: inline-block;
    padding: 5px;
    width: 100px
}
  .box {
    background: darkgrey;
    border: 5px solid gray;
    width: 80px;
    height: 80px;
    color: white;
    text-align:center;
  }
  .name{
    font-size :10px;
  }
  .id{
    font-size :10px;
  }
  .clientactive {
    background: green;
    border: 5px solid rgb(1, 85, 1);
  }

  .avaibleExperiment {
     cursor:pointer;
     color:#d58b8e;
     text-decoration:none;
  }
  .avaibleExperiment:hover {
     text-decoration:underline;
     color:#a8987b;
}

.btn-start-exp{
  background-color: green ;
  font-size: 25px;
      width: 100px;
    height: 80px;
    margin-left: 50px;
    box-shadow: 3px 5px #e4e4e4;
}

.btn-stop-exp{
  background-color: crimson;
  font-size: 25px;
      width: 100px;
    height: 80px;
    margin-left: 50px;
    box-shadow: 3px 5px #e4e4e4;

}

</style>
