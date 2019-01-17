const operatingForm = {
  state: {
    operatingFormData: {},
    operatingSum: 0,
    performanceFormData: {},
    performanceSum: 0,
  },
  mutations: {
    setOperatingForm: (state, data) => {
      state.operatingFormData = data;
    },
    setOperatingSum: (state, data) => {
      state.operatingSum = data;
    },
    setPerformanceForm: (state, data) => {
      state.performanceFormData = data;
    },
    setPerformanceSum: (state, data) => {
      state.performanceSum = data;
    },
  },
  action: {},
};

export default operatingForm;
