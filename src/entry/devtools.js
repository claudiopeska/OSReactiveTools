import Vue from 'vue'
import App from '../view/devtools.vue'
import { BootstrapVue/*, BootstrapVueIcons*/ } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

Vue.use(BootstrapVue);
//Vue.use(BootstrapVueIcons);

chrome.devtools.panels.create('OS Reactive Tools', '', 'devtools.html');
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App)
}).$mount('#app')