<template>
  <div class="experiments">
    <h2>Avaible Experiments</h2>
    <ul id="experimentslist">
      <li v-for="item in experimentsList" >
        <button v-on:click="startExperiment(item)">Start {{item.name}} </button>
        <div> duration:  <input v-model="item.sessionConfig.duration" placeholder="edit me">  </div>
        <div>timeOutDuration:<input v-model="item.sessionConfig.timeOutDuration" placeholder="edit me">  </div>
          <div class="client"  v-for="client in item.clientAssignments">
            <div class="box" v-bind:class="{clientActive: client.active}">
               {{client.assignedRat}}
            </div>
            <div> {{client.id}}</div>
            <div>{{client.name}}</div>
            
          </div>
      </li>
     </ul>

  </div>

</template>

<script>
export default {
  name: 'experiments',
  props: {
    experimentsList: {
      default: function () { return [] },
      type: Array
    }
  },
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.client{
    display: inline-block;
    padding: 5px;
    width: 100px
}
  .box {
    background: black;
    border: 2px solid black;
    width: 80px;
    height: 80px;
    color: white; 
    text-align:center;
  }
  .client-active {
    border: 2px solid green;
  }

</style>
