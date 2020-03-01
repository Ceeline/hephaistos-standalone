import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/HomePage.vue'
import Login from '../views/LoginPage.vue'

// all the existing imports here
import axios from 'axios'

Vue.use(VueRouter)

function createRouter (state) {
  async function beforeEnter (to, from, next) {
    try {
      const { data: user } = await axios.get('http://localhost:3000/api/v1/me')
      state.user = user
      next()
    } catch (err) {
      console.log('err', err)
      next('/login') // redirect to login if user is not authenticated
    }
  }

  // the function continues in the second panel, not enough space here
  const routes = [
    {
      path: '/',
      redirect: {
        name: 'loginPage'
      }
    },
    {
      path: '/login',
      name: 'loginPage',
      component: Login
    },
    {
      path: '/home',
      name: 'homePage',
      component: Home,
      beforeEnter
    }
  ]

  return new VueRouter({
    routes
  })
}

export default createRouter
