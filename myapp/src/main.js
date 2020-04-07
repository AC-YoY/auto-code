import Vue from 'vue';
import App from './App.vue';
import route from './router';
import store from './store';
const { log } = require('./utils')

Vue.config.productionTip = false;

new Vue({
  router: route,
  store,
  render: (h) => h(App),
}).$mount('#app');
