import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/index'

Vue.config.productionTip = false
// this line allows sending cookies to http://localhost:3000
axios.defaults.withCredentials = true
Vue.use(VueAxios, axios)

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
