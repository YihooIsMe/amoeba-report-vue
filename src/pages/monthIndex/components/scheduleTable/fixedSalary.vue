<template>
    <div class="fixedSalary">
      <table class="fixedSalaryTable" v-if="fixedSalaryData.length>0" border="1">
        <thead>
        <tr>
          <th>职称</th>
          <th>固定薪资</th>
          <th>人数</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in fixedSalaryData" :key="i" :class="item.className">
          <template v-if="item.IsRead === 2">
            <td>{{item.Name}}</td>
            <td colspan="2">
              <input type="text"
                     @keyup="handleInputNum"
                     :value="item.Valuation"
                     @change="scheduleCalculation(fixedSalaryData, '.fixedSalaryTable', 0, 1, 2)"
                     :disabled="inputDisabled"/>
            </td>
            <td><input type="text" disabled/></td>
          </template>
          <template v-else>
            <td>{{item.Name}}</td>
            <td>
              <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(fixedSalaryData, '.fixedSalaryTable', 0, 1, 2)"
                     :value="item.Valuation"
                     :readonly="item.IsRead === 1||item.IsRead === 3"
                     :disabled="inputDisabled"
              />
            </td>
            <td>
              <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(fixedSalaryData, '.fixedSalaryTable', 0, 1, 2)"
                     :value="$store.state.comData.commonData.draft === 1 ? item.Amount : ''"
                     :disabled="inputDisabled"
              >
            </td>
            <td>
              <input type="text" disabled/>
            </td>
          </template>
        </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
import sch from '@/assets/js/scheduleTableCalculation';

export default {
  name: 'fixedSalary',
  props: ['fixedSalaryData'],
  methods: {
    handleInputNum(e) {
      sch.scheduleHandleInputNum(e);
    },
    scheduleCalculation(a, b, c, d, e) {
      console.log(1);
      sch.calculation(a, b, c, d, e);
      this.$emit('fixedSalarySum', [2, sch.sumCalculate('.fixedSalaryTable')]);
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.fixedSalaryLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
  },
  watch: {
    isLoadCompleted() {
      this.scheduleCalculation(this.fixedSalaryData, '.fixedSalaryTable', 0, 1, 2);
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$store.commit('setFixedSalaryLoadCompleted', true);
    });
  },
};
</script>

<style scoped lang="less">
  .fixedSalaryTable td:nth-child(3){
    padding-left: 0;
    input{
      text-indent: 10px;
    }
  }
</style>
