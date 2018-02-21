<template>
  <div class="experiments">
    <h2>Avaible Experiments</h2>
    

    <div class="row">
      <div class="col-sm-3">
        <ul class="experimentslist">
          <li v-for="item in experimentsList" >
            <span v-on:click="selectExperiment(item)"> {{item.name}} </span>
          </li>
        </ul>
      </div>
      <div class="col-sm-9">
         <div>
           <h1>{{currentExperiment.name}} </h1>
        <button v-on:click="startExperiment()">Start</button>
        <div> duration:  <input v-model="currentExperiment.sessionConfig.duration" placeholder="edit me">  </div>
        <div>timeOutDuration:<input v-model="currentExperiment.sessionConfig.timeOutDuration" placeholder="edit me">  </div>
          <div class="client"  v-for="client in currentExperiment.clientAssignments">
            <div class="box" v-bind:class="{clientactive: isActive(client)}">
               {{client.assignedRat}}
            </div>
            <div class="name">{{client.name}}</div>
            <div class="id">({{client.id}})</div>
          </div>

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
    return {currentExperiment: {
      sessionConfig: {},
      clientAssignments: []
    }}
  },
  methods: {
    isActive: function (client) {
      return client.active
    },
    selectExperiment (item) {
      this.currentExperiment = item
    },
    startExperiment: function () {
      var config = this.currentExperiment
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

</style>
