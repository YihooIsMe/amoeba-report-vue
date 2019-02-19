<template>
    <div class="welfareFee">
      <table class="welfareFeeTable" v-if="welfareFeeTableData.length>0" border="1">
        <thead>
        <tr>
          <th></th>
          <th>数额</th>
          <th>人数</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in welfareFeeTableData" :key="i" :class="item.className">
          <template v-if="item.IsRead === 2">
            <td><div>{{item.Name}}</div></td>
            <td colspan="2">
              <input type="text"
                     :value="item.Amount"
                     @change="scheduleCalculation(welfareFeeTableData, '.welfareFeeTable', 0, 1, 2, $event)"
                     :disabled="inputDisabled || item.className === 'FE0'"/>
            </td>
            <td><input type="text" disabled/></td>
          </template>
          <template v-else>
            <td><div>{{item.Name}}</div></td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(welfareFeeTableData, '.welfareFeeTable', 0, 1, 2, $event)"
                     :value="item.IsRead === 3 ?item.Description:item.Valuation"
                     :readonly="item.IsRead === 1||item.IsRead === 3"
                     :disabled="inputDisabled"
              />
            </td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(welfareFeeTableData, '.welfareFeeTable', 0, 1, 2, $event)"
                     :value="$store.state.comData.commonData.draft === 1 ? item.Amount : ''"
                     :disabled="inputDisabled || item.className === 'FE0'"
              >
            </td>
            <td>
              <input type="text" disabled/>
            </td>
          </template>
        </tr>
        </tbody>
      </table>
      <div class="schedule-note red">其他福利费：门店达成奖励、工伤医疗费等</div>
    </div>
</template>

<script>
import sch from '@/assets/js/scheduleTableCalculation';

export default {
  name: 'welfareFee',
  props: ['welfareFeeTableData', 'fixedSalaryData'],
  methods: {
    commonCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('welfareFeeSum', [4, sch.sumCalculate('.welfareFeeTable')]);
    },
    scheduleCalculation(a, b, c, d, e, f) {
      sch.scheduleHandleInputNum(f);
      this.commonCalculation(a, b, c, d, e);
    },
    setStoreNumOfPeople() {
      let sum = 0;
      // IsFixedSalary表示固定工资人数合计;
      this.fixedSalaryData.forEach((el) => {
        if (el.IsFixedSalary === 1) {
          sum = Number(document.querySelector('.fixedSalaryTable>tbody>tr.' + el.className + '>td:nth-child(3)>input').value) + sum;
        }
      });
      // 店主管人数
      const storeManager = Number(document.querySelector('.fixedSalaryTable>tbody>tr.FC0>td:nth-child(3)>input').value);
      // 保障薪人数
      const guaranteedSalary = Number(document.querySelector('.fixedSalaryTable>tbody>tr.FC9>td:nth-child(3)>input').value);
      // 秘书人数
      const secretary = Number(document.querySelector('.fixedSalaryTable>tbody>tr.FC10>td:nth-child(3)>input').value);
      // 计算门店福利金人数
      document.querySelector('.welfareFeeTable>tbody>tr.FE0>td:nth-child(3)>input').value = sum - storeManager - guaranteedSalary - secretary + 1;
      sch.setCalculatedPeopleNumber(sum - storeManager - guaranteedSalary - secretary);
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.welfareFeeLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
    recoveryPerformance() {
      return this.$store.state.operatingForm.performanceSum;
    },
    // scheduleTabIndex() {
    //   return this.$store.state.scheduleForm.scheduleTabIndex;
    // },
    /* 当固定工资变动的时候，此时的福利费用也应当变化 */
    isSumFixedSalary() {
      return this.$store.state.scheduleForm.sumScheduleForm.sumFixedSalary;
    },
  },
  watch: {
    isLoadCompleted() {
      this.commonCalculation(this.welfareFeeTableData, '.welfareFeeTable', 0, 1, 2);
    },
    // scheduleTabIndex(newVal) {
    //   if (newVal === 4) {
    //     this.setStoreNumOfPeople();
    //     this.commonCalculation(this.welfareFeeTableData, '.welfareFeeTable', 0, 1, 2);
    //   }
    // },
    recoveryPerformance(newVal) {
      this.$nextTick(() => {
        document.querySelector('.welfareFeeTable>tbody>tr.FE0>td:nth-child(2)>input').value = Number(newVal) * 0.03;
        this.commonCalculation(this.welfareFeeTableData, '.welfareFeeTable', 0, 1, 2);
      });
    },
    isSumFixedSalary() {
      this.setStoreNumOfPeople();
      this.commonCalculation(this.welfareFeeTableData, '.welfareFeeTable', 0, 1, 2);
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$store.commit('setWelfareFeeLoadCompleted', true);
    });
  },
};
</script>

<style scoped lang="less">

</style>
