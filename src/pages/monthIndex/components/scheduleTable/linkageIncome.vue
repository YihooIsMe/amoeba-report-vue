<template>
    <div class="linkageIncome">
      <table class="linkageIncomeTable" v-if="linkageIncomeData.length>0" border="1">
        <thead>
        <tr>
          <th>联动收入</th>
          <th>计价</th>
          <th>人数/次数/时数</th>
          <th>总计</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in linkageIncomeData" :key="i" :class="item.className">
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td>
            <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(i + 1, '.linkageIncomeTable', 1, 2, 3)"
                     :value="$store.state.comData.commonData.draft === 1 ? item.Amount : ''"
            /></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
import sch from '@/assets/js/scheduleTableCalculation';

export default {
  name: 'linkageIncome',
  props: ['linkageIncomeData'],
  methods: {
    handleInputNum(e) {
      sch.scheduleHandleInputNum(e);
    },
    scheduleCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('linkageIncomeSum', [1, sch.sumCalculate(3, '.linkageIncomeTable')]);
    },
  },
};
</script>

<style lang="less" scoped>

</style>
