const districtSchedule = {
  state: {
    storeList: [],
    sumDistrictSchedule: {
      sumSigningFeeAdjustment: 0,
      sumChangeBonus: 0,
      sumWithholdingBonus: 0,
      sumBusinessAdjustment: 0,
      sumWelfareFee: 0,
    },
    MonthAreaFB: '',
    signingFeeAdjustmentData: '',
    businessAdjustmentData: '',
  },
  mutations: {
    setStoreList: (state, data) => {
      state.storeList = data;
    },
    setSumDistrictSchedule: (state, data) => {
      state.sumDistrictSchedule[data.type] = data.sumVal;
    },
    setMonthAreaFB: (state, data) => {
      state.MonthAreaFB = data;
    },
    setSigningFeeAdjustmentData: (state, data) => {
      state.signingFeeAdjustmentData = data;
    },
    setBusinessAdjustmentData: (state, data) => {
      state.businessAdjustmentData = data;
    },
  },
  action: {

  },
};
export default districtSchedule;
