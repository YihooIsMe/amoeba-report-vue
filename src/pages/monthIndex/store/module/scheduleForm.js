const scheduleForm = {
  state: {
    scheduleFormData: {},
    ownershipFeeLoadCompleted: '',
    carStickerLoadCompleted: '',
    fixedSalaryLoadCompleted: '',
    linkageIncomeLoadCompleted: '',
    variableWageLoadCompleted: '',
    welfareFeeLoadCompleted: '',
    workingMealLoadCompleted: '',
    sumScheduleForm: {
      sumOwnershipFee: 0,
      sumCarSticker: 0,
      sumFixedSalary: 0,
      sumLinkageIncome: 0,
      sumVariableWage: 0,
      sumWelfareFee: 0,
      sumWorkingMeal: 0,
    },
    isCompleted: false,
  },
  mutations: {
    setScheduleFormData: (state, data) => {
      state.scheduleFormData = data;
    },
    sumScheduleForm: (state, data) => {
      state.sumScheduleForm[data.type] = data.sumVal;
    },
    setCompleted: (state, data) => {
      state.isCompleted = data;
    },
    setOwnershipFeeLoadCompleted: (state, data) => {
      state.ownershipFeeLoadCompleted = data;
    },
    setCarStickerLoadCompleted: (state, data) => {
      state.carStickerLoadCompleted = data;
    },
    setFixedSalaryLoadCompleted: (state, data) => {
      state.fixedSalaryLoadCompleted = data;
    },
    setLinkageIncomeLoadCompleted: (state, data) => {
      state.linkageIncomeLoadCompleted = data;
    },
    setVariableWageLoadCompleted: (state, data) => {
      state.variableWageLoadCompleted = data;
    },
    setWelfareFeeLoadCompleted: (state, data) => {
      state.welfareFeeLoadCompleted = data;
    },
    setWorkingMealLoadCompleted: (state, data) => {
      state.workingMealLoadCompleted = data;
    },
  },
  action: {

  },
};
export default scheduleForm;
