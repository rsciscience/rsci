// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import experiments from './components/experiments.vue'
import clientPicker from './components/clientPicker.vue'
import experimentCurrent from './components/experiment.current.vue'
import router from './router'
import VueSocketio from 'vue-socket.io'
import url from 'url'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from './store/index'

var location = url.parse(window.location.href)

Vue.use(VueSocketio, 'http://' + location.hostname + ':3003')
Vue.use(BootstrapVue)
Vue.use(Vuex)
Vue.component('experiments', experiments)
Vue.component('clientPicker', clientPicker)
Vue.component('experimentCurrent', experimentCurrent)

const _store = store.init()

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: _store,
  template: '<App/>',
  components: { App }
})
