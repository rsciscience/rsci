<template>
  <div class="experiments">
    <h2>Experiments</h2>

     <div class="row">
      <div class="col-sm-2">
        <ul class="experimentslist">
          <li v-for="item in experimentsList" v-bind:key="item.name" >
            <span class="avaibleExperiment" v-on:click="selectExperiment(item)"> {{item.name}} </span>
          </li>
        </ul>
      </div>
      <div class="col-sm-5">
        <div  v-for="(value, propertyName,index) in currentExperiment.sessionVariables">
            <div><label>{{propertyName}}:</label> <input class="session-config-input" v-model="currentExperiment.sessionVariables[propertyName]"  placeholder="edit me">  </div>
        </div>
      </div>
        <div class="col-sm-5">
        <button  class = "btn btn-start-exp"  v-on:click="startExperiment()">Start</button>
        <div><span class="config-detail-label">name:</span> {{ currentExperiment.name }}</div>
        <div><span class="config-detail-label">type:</span> {{ currentExperiment.type }}</div>
        <div><span class="config-detail-label">version:</span> {{ currentExperiment.version }}</div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-2">

        </div>
        <div class="col-sm-10">
          <clientPicker class="client-picker" v-bind:initialConfig="initialConfig"></clientPicker>
        </div>
      </div>
</div>
</template>

<script>
import {HTTP} from '../http-common'

export default {
  name: 'experiments',
  props: {
    initialConfig: {
      default: function () { return [] },
      type: Array
    },
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
      hasCurrentExperiment: false
    }
  },
  methods: {
    isActive: function (client) {
      return client.active
    },
    selectExperiment (item) {
      this.currentExperiment = item
      this.hasCurrentExperiment = true
      this.$emit('selectExperiment', item.id)
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

.experimentsList span:hover{
  color: blue;
}
.client{
    display: inline-block;
    padding: 5px;
    width: 100px
}
.client-picker {
    margin-top: 45px;
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
    font-size: 18px;
    font-weight: bold;
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
  box-shadow: 3px 5px #e4e4e4;
  margin-bottom: 20px;
}

.btn-stop-exp{
  background-color: crimson;
  font-size: 25px;
      width: 100px;
    height: 80px;
    margin-left: 50px;
    box-shadow: 3px 5px #e4e4e4;

}
.session-config-input {
  margin-left: 15px;
}
.config-detail-label {
  min-width: 70px;
  text-transform: capitalize;
}

</style>
