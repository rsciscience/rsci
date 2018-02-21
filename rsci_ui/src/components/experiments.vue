<template>
  <div class="experiments">
    <h2>Avaible Experiments</h2>
    <ul id="experimentslist">
      <li v-for="item in experimentsList" >
        <button v-on:click="startExperiment(item)">Start {{item.name}} </button>
        <div> duration:  <input v-model="item.sessionConfig.duration" placeholder="edit me">  </div>
        <div>timeOutDuration:<input v-model="item.sessionConfig.timeOutDuration" placeholder="edit me">  </div>
          <div v-for="client in item.clientAssignments">
            <div class="client" v-bind:class="{clientActive: client.active}">
               {{client.assignedRat}}
            </div>
            {{client.id}} {{client.name}}
          </div>
      </li>
     </ul>

  </div>

</template>

<script>
export default {
  name: 'Job',
  data () {
    return {
    }
  },
  props: {
    experimentList: {
      default: function () { return [] },
      type: Array
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .client {
    width: 80px;
    height: 80px;
    display: inline;
  }
  .client-active {
    border: 2px solid green;
  }

</style>
