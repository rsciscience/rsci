<template>
  <div class="clientPicker">

    <div class="container">
      <div class="row">
        <div class="col-sm column-1">
          <div class="client"  v-for="client in clientsExperiment">
              <div class="box" v-bind:class="{clientactive: isActive(client)}" v-on:click="client.selected = !client.selected">
                <img src="/src/assets/logoActive.png" class="isSelectedRat" v-show="client.selected" />
                <!-- <img src="/src/assets/logo.png" class="isNotSelectedRat" v-show="!client.selected" /> -->

              </div>
              <div class="id">{{client.clientId}} : {{client.ratId}}</div>
          </div>
        </div>
        <div class="col-sm">
          <div class="client"  v-for="client in clientsOther">
            <div class="box" v-bind:class="{clientactive: isActive(client)}">

            </div>
            <div class="id">{{client.clientId}} : unassigned</div>
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
    clientList: {
      default: function () { return [] },
      type: Array
    }
  },
  data () {
    return {
      clientsExperiment: [{
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
          selected: false,
          unassigned: false
        },
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
          selected: false,
          unassigned: false
        },
        {
          active: false,
          clientId: 'box3',
          ratId: 'ratC',
          selected: true,
          unassigned: false
        }],
      clientsOther: [
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
        }]
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
  watch: {
    clientList: function (newVal, oldVal) { // watch it
      debugger
      this.clientsExperiment = []
      this.clientsOther = []
      newVal.foreach(function (client) {
        if (client.unassigned) {
          this.clientsOther.push(client)
        } else {
          this.clientsExperiment.push(client)
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

.client{
    display: inline-block;
    padding: 5px;
    width: 100px;
    text-align: center;
}
  .box {
    background: #312e2e;
    border: 5px solid #bfbcbc;
    width: 80px;
    height: 80px;
    color: white;
    margin: 0 auto;
  }
  .name{
    font-size :10px;
  }
  .id{
    font-size :13px;
    text-align: center;
  }
  .clientactive {
    background: grey;
    border: 5px solid #bfbcbc;
  }
  .isSelectedRat {
    margin-top: 2px;
    height: 60px;
    width: 60px;
  }
  .isNotSelectedRat {
    margin-top: 22px;
    height: 35px;
    width: 35px;
  }
  .isNotSelectedRat img {
    opacity: .7;
  }
  .column-1 {
    border-right: 1px solid grey;
  }
  .col-sm {
    text-align: center;
  }



</style>
