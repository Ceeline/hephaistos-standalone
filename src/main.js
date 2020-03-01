import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
// this line allows sending cookies to http://localhost:3000
axios.defaults.withCredentials = true
Vue.use(VueAxios, axios)

const state = {
  user: {}
}

new Vue({
  data: state,
  router: createRouter(state),
  vuetify,
  render: h => h(App)
}).$mount('#app')
