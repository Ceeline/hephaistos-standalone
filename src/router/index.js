import Vue from 'vue'
import VueRouter from 'vue-router'
import Exercise from '../views/ExercisePage.vue'
import Login from '../views/LoginPage.vue'
import Modules from '../views/ModulesPage.vue'
import Module from '../views/ModulePage.vue'
import Student from '../views/StudentPage.vue'
import store from '../store/index'

Vue.use(VueRouter)

async function beforeEnter (_to, _from, next) {
  if (!store.getters['user/isAuthenticated']) {
    await store.dispatch('user/fetchUser')
  }
  if (store.getters['user/isAuthenticated']) {
    next()
    return
  }
  next('/login')
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
    path: '/exercise',
    name: 'exercisePage',
    component: Exercise,
    beforeEnter
  },
  {
    path: '/modules',
    name: 'modulesPage',
    component: Modules,
    beforeEnter
  },
  {
    path: '/module/:id',
    name: 'modulePage',
    component: Module,
    beforeEnter
  },
  {
    path: '/student/:idSession/:idExercise',
    name: 'studentPage',
    component: Student,
    beforeEnter
  }
]

export default new VueRouter({
  routes
})
