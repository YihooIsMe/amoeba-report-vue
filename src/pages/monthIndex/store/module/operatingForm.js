const operatingForm = {
  state: {
    operatingFormData: {},
    performanceFormData: {},
  },
  mutations: {
    setOperatingForm: (state, data) => {
      state.operatingFormData = data;
    },
    setPerformanceForm: (state, data) => {
      state.performanceFormData = data;
    },
  },
  action: {},
};

export default operatingForm;
