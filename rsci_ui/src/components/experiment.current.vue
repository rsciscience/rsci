<template>
  <div class="running">

    <div class="row">
      <div class="col-sm-2">
        <h4>Running</h4>    
        session: {{ experimentSession.experimentSessionId }}
        <button class = "btn btn-stop-exp"  v-on:click="alert('Yeah,,, not wired ')">Stop</button>

      </div>

      <div class="col-sm-10">
        <div class="client"  v-for="client in experimentSession.clients" v-bind:key="client.clientId">
          <div class="box" v-bind:class="{isOnline: isOnline(client)}" >
          <svg style='width: 100%; height: 100%;  position:relitive; left:0; top:0'>
            <line x1="0" y1="100%" x2="100%" y2="0" style="stroke:rgb(191,188,188);stroke-width:2"/>
            <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(191,188,188);stroke-width:2"/>
            <rect width="30" height="30" x="20" y="20" class="box-back" />
          </svg>

          <img src="/src/assets/logoActive.png" class="isRecientActiveRat" v-show="recientActvity(client)" />
          <img src="/src/assets/logo.png" class="isNotRecientActiveRat" v-show="!recientActvity(client)" />
          </div>

          <div class="box-label" v-bind:class="{isOnline: isOnline(client)}">
            <div class="id">{{client.clientId}}</div>
            <div class="assignedRat">{{client.assignedRat}}</div>
            <div class="last-action"> {{client.lastActionType}}</div>
          </div>
        </div>

      </div>  
    </div>  
  </div>
</template>

<script>

export default {
  name: 'experimentCurrent',
  props: {
    experimentSession: {
      default: function () {
        return {
          experimentSessionId: '',
          clients: [{
            isOnline: true,
            assignedRat: 'rat??',
            clientId: '',
            lastActionType: '',
            lastActionTimeStamp: new Date(),
            secondsSinceAction: 0
          }]
        }
      },
      type: Object
    }
  },
  data () {
    return {
    }
  },
  methods: {
    isOnline: function (client) {
      return client.isOnline
    },
    recientActvity: function (client) {
      let t1 = new Date(client.lastActionTimeStamp)
      let t2 = new Date()
      let dif = t2.getTime() - t1.getTime()
      console.log(client.clientId, dif)
      return (dif < 30000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .client{
      display: inline-block;
      padding: 5px;
      width: 100px;
      text-align: center;

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
  .btn-stop-exp{
    background-color: crimson;
    font-size: 12px;
    width: 50px;
    height: 40px;
    box-shadow: 3px 5px #e4e4e4;
  }
  .clientactive {
    background: green;
    border: 5px solid rgb(1, 85, 1);
  }
  .last-action{
    color:white;
    font-size: 10px
  }

</style>
