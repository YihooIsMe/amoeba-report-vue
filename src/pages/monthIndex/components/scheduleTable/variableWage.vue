<template>
    <div class="variableWage">
      <table class="variableWageTable" v-if="variableWageData.length>0" border="1">
        <thead>
        <tr>
          <th>奖励</th>
          <th>基数</th>
          <th>业绩</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in variableWageData" :key="i" :class="item.className">
          <template v-if="item.IsRead === 2">
            <td><div>{{item.Name}}</div></td>
            <td colspan="2">
              <input type="text"
                     :value="item.Amount"
                     @change="scheduleCalculation(variableWageData, '.variableWageTable', 0, 1, 2, $event)"
                     :disabled="inputDisabled || item.className === 'FD0' || item.className === 'FD1'"/>
            </td>
            <td><input type="text" disabled/></td>
          </template>
          <template v-else>
            <td><div>{{item.Name}}</div></td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(variableWageData, '.variableWageTable', 0, 1, 2, $event)"
                     :value="item.IsRead === 3 ?item.Description:item.Valuation"
                     :readonly="item.IsRead === 1||item.IsRead === 3"
                     :disabled="inputDisabled"
              />
            </td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(variableWageData, '.variableWageTable', 0, 1, 2, $event)"
                     :value="$store.state.comData.commonData.draft === 1 ? item.Amount : ''"
                     :disabled="inputDisabled || item.className === 'FD0' || item.className === 'FD1'"
              />
            </td>
            <td>
              <input type="text" disabled/>
            </td>
          </template>
        </tr>
        </tbody>
      </table>
      <div class="schedule-note red">其他奖金：绩效奖金、中秋奖金、龙虎榜奖金、激励奖金等</div>
    </div>
</template>

<script>
import sch from '@/assets/js/scheduleTableCalculation';

export default {
  name: 'variableWage',
  props: ['variableWageData'],
  methods: {
    commonCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('variableWageSum', [3, sch.sumCalculate('.variableWageTable')]);
    },
    scheduleCalculation(a, b, c, d, e, f) {
      sch.scheduleHandleInputNum(f);
      this.commonCalculation(a, b, c, d, e);
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.variableWageLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
    recoveryPerformance() {
      return this.$store.state.operatingForm.performanceSum;
    },
    /* 当固定工资变动的时候，此时的变动工资也随之变化 */
    isSumFixedSalary() {
      return this.$store.state.scheduleForm.sumScheduleForm.sumFixedSalary;
    },
  },
  watch: {
    isLoadCompleted() {
      this.commonCalculation(this.variableWageData, '.variableWageTable', 0, 1, 2);
    },
    recoveryPerformance(newVal) {
      this.$nextTick(() => {
        document.querySelector('.variableWageTable>tbody>tr.FD0>td:nth-child(3)>input').value = Number(newVal);
        document.querySelector('.variableWageTable>tbody>tr.FD1>td:nth-child(3)>input').value = Number(newVal);
        this.commonCalculation(this.variableWageData, '.variableWageTable', 0, 1, 2);
      });
    },
    isSumFixedSalary() {
      this.commonCalculation(this.variableWageData, '.variableWageTable', 0, 1, 2);
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$store.commit('setVariableWageLoadCompleted', true);
    });
  },
};
</script>

<style scoped lang="less">

</style>
