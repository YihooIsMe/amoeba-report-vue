import Vue from 'vue';
import { Button, Loading } from 'element-ui';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Loading);

new Vue({
  render: h => h(App),
}).$mount('#app');
