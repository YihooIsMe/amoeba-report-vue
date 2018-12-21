const scheduleForm = {
  state: {
    scheduleFormData: {},
    sumScheduleForm: {
      sumOwnershipFee: 0,
      sumCarSticker: 0,
      sumFixedSalary: 0,
      sumLinkageIncome: 0,
      sumVariableWage: 0,
      sumWelfareFee: 0,
      sumWorkingMeal: 0,
    },
  },
  mutations: {
    setScheduleFormData: (state, data) => {
      state.scheduleFormData = data;
    },
    sumScheduleForm: (state, data) => {
      state.sumScheduleForm[data.type] = data.sumVal;
    },
  },
  action: {

  },
};
export default scheduleForm;
