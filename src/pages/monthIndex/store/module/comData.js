const comData = {
  state: {
    commonData: {},
    inputDisabled: false,
    showDraftAndSubmit: false,
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
    setInputDisabled: (state, data) => {
      state.inputDisabled = data;
    },
    setShowDraftAndSubmit: (state, data) => {
      state.showDraftAndSubmit = data;
    },
  },
  action: {

  },
};
export default comData;
