import Vue from 'vue';
import { Button, Tabs, TabPane } from 'element-ui';
import '../../assets/css/statisticalReport.css';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Tabs);
Vue.use(TabPane);

new Vue({
  render: h => h(App),
}).$mount('#app');
