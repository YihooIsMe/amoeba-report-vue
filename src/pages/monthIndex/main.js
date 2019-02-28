import Vue from 'vue';

import {
  Button,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Dialog,
  Form,
  FormItem,
  Loading,
  Card,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/statisticalReport.css';
import App from './App.vue';
import store from './store/index';

Vue.config.devtools = true;
Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Loading);
Vue.use(Card);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
