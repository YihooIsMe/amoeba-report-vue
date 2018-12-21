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
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td>
            <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(i + 1, '.variableWageTable', 1, 2, 3)"
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
  name: 'variableWage',
  props: ['variableWageData'],
  methods: {
    handleInputNum(e) {
      sch.scheduleHandleInputNum(e);
    },
    scheduleCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('variableWageSum', [3, sch.sumCalculate(3, '.variableWageTable')]);
    },
  },
};
</script>

<style scoped>

</style>
