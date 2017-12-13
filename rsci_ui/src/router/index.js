import Vue from 'vue'
import Router from 'vue-router'
import job from '@/components/job'
import admin from '@/components/admin'
import client from '@/components/client'

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
