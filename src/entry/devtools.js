import Vue from 'vue'
import App from '../view/devtools.vue'
import { BootstrapVue } from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(BootstrapVue);

const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
};

Vue.use(VueSweetalert2,options);

chrome.devtools.panels.create('OS Reactive Tools', '', 'devtools.html');

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App)
}).$mount('#app')