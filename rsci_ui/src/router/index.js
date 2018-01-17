import Vue from 'vue'
import Router from 'vue-router'
import job from '@/components/job'
import admin from '@/components/admin'
import client from '@/components/client'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'job',
      component: job
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
    }
  ]
})
