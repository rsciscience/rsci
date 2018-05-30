<template>
  <div class="clientPicker">

    <div class="container">
      <div class="row">
        <div class="col-sm column-1">
           <h4>Expected</h4>
          <div class="client"  v-for="client in initialConfig">
              <div class="box" v-bind:class="{clientactive: isActive(client)}" v-on:click="client.selected = !client.selected">
               <svg style='width: 100%; height: 100%;  position:relitive; left:0; top:0'>
                <line x1="0" y1="100%" x2="100%" y2="0" style="stroke:rgb(191,188,188);stroke-width:2"/>
                <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(191,188,188);stroke-width:2"/>
                <rect width="30" height="30" x="20" y="20" class="box-back" />
              </svg>
                <img src="/src/assets/long-evans-2a.png" class="isSelectedRat" v-show="client.selected" />
              </div>

              <div class="box-label" v-bind:class="{clientactive: isActive(client)}">
                <div class="id">{{client.clientId}}</div>
                <div class="ratId">{{client.ratId}}</div>
              </div>
          </div>
        </div>
        <div class="col-sm">
           <h4>Available</h4>
          <div class="client"  v-for="client in initialConfig">
            <div class="box" v-bind:class="{clientactive: isActive(client)}">
                 <svg style='width: 100%; height: 100%;  position:relitive; left:0; top:0'>
                <line x1="0" y1="100%" x2="100%" y2="0" style="stroke:rgb(191,188,188);stroke-width:2"/>
                <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(191,188,188);stroke-width:2"/>
                <rect width="30" height="30" x="20" y="20" class="box-back" />
              </svg>
            </div>
             <div class="box-label" v-bind:class="{clientactive: isActive(client)}">
                <div class="id">{{client.clientId}}</div>
                <div class="ratId">{{client.ratId}}</div>
              </div>

          </div>
        </div>
      </div>
    </div>

<div class="running">
   <h4>Running</h4>
    <div class="client"  v-for="client in clientsRunning">
        <div class="box" v-bind:class="{clientactive: isActive(client)}" >
          <svg style='width: 100%; height: 100%;  position:relitive; left:0; top:0'>
          <line x1="0" y1="100%" x2="100%" y2="0" style="stroke:rgb(191,188,188);stroke-width:2"/>
          <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(191,188,188);stroke-width:2"/>
          <rect width="30" height="30" x="20" y="20" class="box-back" />
        </svg>

          <img src="/src/assets/logoActive.png" class="isRecientActiveRat" v-show="client.recientActvity" />
          <img src="/src/assets/logo.png" class="isNotRecientActiveRat" v-show="!client.recientActvity" />

        </div>

        <div class="box-label" v-bind:class="{clientactive: isActive(client)}">
          <div class="id">{{client.clientId}}</div>
          <div class="ratId">{{client.ratId}}</div>
        </div>
        <div class="last-action"> {{client.lastaction}}</div>

    </div>

  </div>
</div>

</template>

<script>
// import {HTTP} from '../http-common'

export default {
  name: 'clientPicker',
  props: {
    initialConfig: {
      default: function () { return [] },
      type: Array
    }
  },
  data () {
    return {
      clientsRunning: [
        {
          active: true,
          clientId: 'box10',
          ratId: 'ratG',
          selected: true,
          unassigned: true,
          running: true,
          lastaction: 'timeout',
          recientActvity: true
        },
        {
          active: true,
          clientId: 'box11',
          ratId: 'ratJ',
          selected: true,
          unassigned: true,
          running: true,
          lastaction: 'buttonpress',
          recientActvity: true
        },
        {
          active: true,
          clientId: 'box12',
          ratId: 'ratx',
          selected: true,
          unassigned: true,
          running: true,
          lastaction: 'winner',
          recientActvity: false
        }
      ]
    }
  },
  methods: {
    isActive: function (client) {
      return client.active
    },
    selectClient (item) {
    },
    isAssignedRat (client) {
      return client.assigned
    },
    isSelected (client) {
      client.selected = !client.selected
    }
  },
  
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

.running{
  margin: 30px;
    border-top: black 1px solid;
    padding: 5px;

}
.client{
    display: inline-block;
    padding: 5px;
    width: 100px;
    text-align: center;

}
h4{
  text-align: left;
}
  .box {
    background: rgb(216, 211, 211);
    border: 5px solid #bfbcbc;
    width: 80px;
    height: 80px;
    color: white;
    margin: 0 auto;
  }
  .box-back{
    fill:rgb(222, 222, 222);
    stroke-width:3;
    stroke:rgb(191,188,188)
  }
  .clientactive {
    background: rgb(216, 211, 211);
    border: 5px solid #bfbcbc;
  }
   .clientactive.box-back {
    background: rgb(216, 211, 211);

  }
  .name{
    font-size :10px;
  }
  .last-action{
    color: black;
    font-style:  italic;
  }
  .box-label{
    margin: 0 auto;
    background-color: crimson;
    color: white;
    padding: 0px;
    border: 0px solid #bfbcbc;
    width: 80px;
  }
  .box-label.clientactive{
    background-color: green !important;
    border: 0px solid #bfbcbc;
  }
  .id{
    font-size :13px;
    text-align: center;
  }

  .isSelectedRat {
        width: 61px;
    top: -36px;
    left: -5px;
    position: relative;
  }
  .isRecientActiveRat {
    width: 66px;
    top: -50px;
    left: 8px;
    position: relative;
  }
  .isNotRecientActiveRat {
    width: 36px;
    top: -50px;
    left: 0px;
    position: relative;
  }

  .column-1 {
    border-right: 1px solid grey;
  }
  .col-sm {
    text-align: center;
  }



</style>
