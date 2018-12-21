import Vue from 'vue';
import Vuex from 'vuex';
import mainForm from './module/mainForm';
import scheduleForm from './module/scheduleForm';
import comData from './module/comData';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    comData,
    mainForm,
    scheduleForm,
  },
});
export default store;
