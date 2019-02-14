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
  },
  mutations: {
    setStoreList: (state, data) => {
      state.storeList = data;
    },
    setSumDistrictSchedule: (state, data) => {
      state.sumDistrictSchedule[data.type] = data.sumVal;
    },
  },
  action: {

  },
};
export default districtSchedule;
