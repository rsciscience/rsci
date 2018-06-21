<template>
  <div class="clientPicker">

    <div>
      <div class="row">
        <div class="col-sm-6 column-1">
           <h4>Expected</h4>
          <div class="client"  v-for="client in filterExpected" v-bind:key="client.clientId">
              <div class="box" v-bind:class="{isOnline: isOnline(client)}" v-on:click="filterExpectedClient_OnClick(client)">
               <svg style='width: 100%; height: 100%;  position:relitive; left:0; top:0'>
                <line x1="0" y1="100%" x2="100%" y2="0" style="stroke:rgb(191,188,188);stroke-width:2"/>
                <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(191,188,188);stroke-width:2"/>
                <rect width="30" height="30" x="20" y="20" class="box-back" />
              </svg>
                <img src="/src/assets/long-evans-2a.png" class="isRatAssigned" v-show="client.isRatAssigned" />
              </div>

              <div class="box-label" v-bind:class="{isOnline: isOnline(client)}">
                <div class="id">{{client.clientId}}</div>
                <div class="assignedRat">{{client.assignedRat}}</div>
                <input class="ratInput" v-model="client.assignedRat" />
              </div>
          </div>
        </div>
        <div class="col-sm-6">
           <h4>Available</h4>
          <div class="client"  v-for="client in filterAvailable" v-bind:key="client.clientId">
            <div class="box" v-bind:class="{isOnline: isOnline(client)}" v-on:click="filterAvailableClient_OnClick(client)">
                 <svg style='width: 100%; height: 100%;  position:relitive; left:0; top:0'>
                <line x1="0" y1="100%" x2="100%" y2="0" style="stroke:rgb(191,188,188);stroke-width:2"/>
                <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(191,188,188);stroke-width:2"/>
                <rect width="30" height="30" x="20" y="20" class="box-back" />
              </svg>
            </div>
             <div class="box-label" v-bind:class="{isOnline: isOnline(client)}">
                <div class="id">{{client.clientId}}</div>
                <div class="assignedRat">{{client.assignedRat}}</div>
              </div>

          </div>
        </div>
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
    }
  },
      // isOnline: false,
      // clientId: ca.clientId,
      // isConfigClientAssignment,
      // assignedRat: ca.assignedRat,
      // isRatAssigned: true,
      // isIncludedInSession: true
  methods: {
    isOnline: function (client) {
      return client.isOnline
    },
    selectClient (item) {
    },
    isAssignedRat (client) {
      return client.isRatAssigned
    },
    isSelected (client) {

    },
    filterExpectedClient_OnClick (client) {
      client.isIncludedInSession = !client.isIncludedInSession

      if (client.isConfigClientAssignment) {
        client.isRatAssigned = !client.isRatAssigned
      } else {
        client.isRatAssigned = false
      }
    },
    filterAvailableClient_OnClick (client) {
      client.isIncludedInSession = !client.isIncludedInSession

      if (!client.isConfigClientAssignment) {
        client.isRatAssigned = true
      }
    }
  },
  computed: {
    filterExpected: function () {
      return this.initialConfig.filter(function (client) {
        if (client.isConfigClientAssignment || client.isIncludedInSession) {
          return client
        }
      })
    },
    filterAvailable: function () {
      return this.initialConfig.filter(function (client) {
        if (client.isIncludedInSession === false && !client.isConfigClientAssignment) {
          return client
        }
      })
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
  .isOnline {
    background: rgb(216, 211, 211);
    border: 5px solid #bfbcbc;
  }
  .isOnline.box-back {
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
  .box-label.isOnline{
    background-color: green !important;
    border: 0px solid #bfbcbc;
  }
  .id{
    font-size :13px;
    text-align: center;
  }

  .isRatAssigned {
    width: 61px;
    top: -36px;
    left: -5px;
    position: relative;
  }

  .column-1 {
    border-right: 1px solid grey;
  }
  .col-sm {
    text-align: center;
  }
  .ratInput {
    display: none;
    width: 100%;
    text-align: center;
    color: black;
    height: 24px;
  }

  .client:hover .ratInput {
    display: block;
  }

  .client:hover .assignedRat {
    display: none;
  }

</style>
