import Vue from 'vue';

const missionList = {
  state: {
    missionListData: [],
    firstWeekData: {},
    secondWeekData: {},
    thirdWeekData: {},
    fourthWeekData: {},
  },
  mutations: {
    setMissionListData: (state, data) => {
      state.missionListData = data;
    },
    setFirstWeekData: (state, data) => {
      Vue.set(state.firstWeekData, data.editorIndex, data.content);
    },
    setSecondWeekData: (state, data) => {
      Vue.set(state.secondWeekData, data.editorIndex, data.content);
    },
    setThirdWeekData: (state, data) => {
      Vue.set(state.thirdWeekData, data.editorIndex, data.content);
    },
    setFourthWeekData: (state, data) => {
      Vue.set(state.fourthWeekData, data.editorIndex, data.content);
    },
  },
  action: {

  },
};
export default missionList;
