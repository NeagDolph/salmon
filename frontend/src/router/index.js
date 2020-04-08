import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dist',
      name: 'App',
      component: App
    }
  ]
})
