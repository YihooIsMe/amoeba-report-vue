import Vue from 'vue';
import { Button, Loading, Pagination } from 'element-ui';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Loading);
Vue.use(Pagination);

new Vue({
  render: h => h(App),
}).$mount('#app');
