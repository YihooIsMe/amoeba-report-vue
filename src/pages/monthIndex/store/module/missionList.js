const missionList = {
  state: {
    missionListData: [],
  },
  mutations: {
    setMissionListData: (state, data) => {
      state.missionListData.push(data);
    },
  },
  action: {

  },
};
export default missionList;
