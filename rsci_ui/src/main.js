// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
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

var location = url.parse(window.location.href)

Vue.use(VueSocketio, 'http://' + location.hostname + ':3003')
Vue.use(BootstrapVue)
Vue.component('experiments', experiments)
Vue.component('clientPicker', clientPicker)
Vue.component('experimentCurrent', experimentCurrent)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
