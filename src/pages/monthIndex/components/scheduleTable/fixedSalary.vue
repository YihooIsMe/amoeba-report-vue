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
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td>
            <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(fixedSalaryData.length, '.fixedSalaryTable', 1, 2, 3)"
                     :value="$store.state.comData.commonData.draft === 1 ? item.Amount : ''"
            ></td>
          <td></td>
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
      sch.calculation(a, b, c, d, e);
      this.$emit('fixedSalarySum', [2, sch.sumCalculate(3, '.fixedSalaryTable')]);
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.fixedSalaryLoadCompleted;
    },
  },
  watch: {
    isLoadCompleted() {
      this.scheduleCalculation(this.fixedSalaryData.length, '.fixedSalaryTable', 1, 2, 3);
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$store.commit('setFixedSalaryLoadCompleted', true);
    });
  },
};
</script>

<style scoped>

</style>
