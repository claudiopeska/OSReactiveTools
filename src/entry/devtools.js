import Vue from 'vue'
import App from '../view/devtools.vue'
import { BootstrapVue/*, BootstrapVueIcons*/ } from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(BootstrapVue);

const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
};
Vue.use(VueSweetalert2,options);
//Vue.use(BootstrapVueIcons);

chrome.devtools.panels.create('OS Reactive Tools', '', 'devtools.html');
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App)
}).$mount('#app')