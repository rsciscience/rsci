<template>
  <div class="experiments">
    <h2>Available Experiments</h2>

  <clientList v-bind:clientList="clientList"></clientList>
    <div class="row">
      <div class="col-sm-3">
        <ul class="experimentslist">
          <li v-for="item in experimentsList" >
            <span class="avaibleExperiment" v-on:click="selectExperiment(item)"> {{item.name}} </span>
          </li>
        </ul>
      </div>
      <div class="col-sm-9">
        <div v-if="hasCurrentExperiment">
          <p>
          <button  class = "btn"  v-on:click="startExperiment()">Start</button> {{currentExperiment.name}}
          </p>
          <div><label>Duration:</label>         <input v-model="currentExperiment.sessionVariables.duration" placeholder="edit me">  </div>
          <div><label>TimeOut Duration:</label> <input v-model="currentExperiment.sessionVariables.timeOutDuration" placeholder="edit me">  </div>
          <h4>Boxes</h4>
          <div class="client"  v-for="client in currentExperiment.clientAssignments">
            <div class="box" v-bind:class="{clientactive: isActive(client)}">
               {{client.assignedRat}}
            </div>
            <div class="id">{{client.clientId}}</div>
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
    return {
      currentExperiment: {
        sessionVariables: {},
        clientAssignments: []
      },
      hasCurrentExperiment: false,
      clientList: [
        {
          active: true,
          clientId: 'box1',
          ratId: 'ratA',
          selected: true,
          unassigned: false
        },
        {
          active: true,
          clientId: 'box2',
          ratId: 'ratB',
          selected: true,
          unassigned: false
        },
        {
          active: false,
          clientId: 'box3',
          ratId: 'ratC',
          selected: true,
          unassigned: false
        },
        {
          active: true,
          clientId: 'box4',
          ratId: '',
          selected: true,
          unassigned: true
        },
        {
          active: true,
          clientId: 'box5',
          ratId: '',
          selected: true,
          unassigned: true
        }
      ]
    }
  },
  methods: {
    isActive: function (client) {
      return client.active
    },
    selectExperiment (item) {
      this.currentExperiment = item
      this.hasCurrentExperiment = true
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



</style>
