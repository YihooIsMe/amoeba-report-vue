import Vue from 'vue';
import Vuex from 'vuex';
import mainForm from './module/mainForm';
import scheduleForm from './module/scheduleForm';
import operatingForm from './module/operatingForm';
import comData from './module/comData';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    comData,
    mainForm,
    scheduleForm,
    operatingForm,
  },
});
export default store;
