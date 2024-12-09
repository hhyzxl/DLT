import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Home2 from '@/components/Home2'

Vue.use(Router)

export default new Router({
  // mode: "history",
  routes: [
    {
      path: '/demo1',
      name: 'Home',
      component: Home
    },    
    {
      path: '/demo2',
      name: 'Home2',
      component: Home2
    },
  ]
})
