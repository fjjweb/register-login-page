import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/Login',
      component: Login
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    }
  ]
})
