const comData = {
  state: {
    commonData: {},
    inputDisabled: false,
    showDraftAndSubmit: false,
  },
  mutations: {
    setCommonData: (state, data) => {
      state.commonData = data;
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
