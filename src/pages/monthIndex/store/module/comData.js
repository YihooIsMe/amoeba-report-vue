const comData = {
  state: {
    commonData: {},
    selectTabPane: sessionStorage.getItem('selectTabPane') || '',
  },
  mutations: {
    setCommonData: (state, data) => {
      state.commonData = data;
    },
    setSelectTabPane: (state, data) => {
      sessionStorage.setItem('selectTabPane', data);
      state.selectTabPane = data;
    },
  },
  action: {

  },
};
export default comData;
