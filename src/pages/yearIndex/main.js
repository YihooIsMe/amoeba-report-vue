import Vue from 'vue';
import {
  Loading, Button, Icon, Upload, Dialog,
} from 'element-ui';
import App from './App.vue';
import router from './router';
import store from './store';
import '../../assets/css/statisticalReport.css';

Vue.config.productionTip = false;
Vue.use(Loading);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Upload);
Vue.use(Dialog);


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
