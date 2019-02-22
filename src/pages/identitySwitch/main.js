import Vue from 'vue';
import {
  Button,
  Tabs,
  TabPane,
  Input,
  Dialog,
  Form,
  FormItem,
  Radio,
  RadioGroup,
} from 'element-ui';
import App from './App.vue';


Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Input);
Vue.use(Dialog);
Vue.use(FormItem);
Vue.use(Form);
Vue.use(RadioGroup);
Vue.use(Radio);

new Vue({
  render: h => h(App),
}).$mount('#app');
