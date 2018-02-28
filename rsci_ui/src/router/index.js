import Vue from 'vue'
import Router from 'vue-router'
import display from '@/components/display'
import admin from '@/components/admin'
import client from '@/components/client'
import vexport from '@/components/export'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'display',
      component: display
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    },
    {
      path: '/client',
      name: 'client',
      component: client
    },
    {
      path: '/export',
      name: 'export',
      component: vexport
    }
  ]
})
