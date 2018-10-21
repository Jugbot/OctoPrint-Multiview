import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import './plugins/vuetify'
import './plugins/axios'
import App from './App.vue'
import VuePersist from 'vue-persist'
 
Vue.use(VuePersist)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
