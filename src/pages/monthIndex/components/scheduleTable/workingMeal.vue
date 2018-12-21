<template>
    <div class="workingMeal">
      <table class="workingMealTable" v-if="workingMealData.length>0" border="1">
        <thead>
        <tr>
          <th></th>
          <th>数额</th>
          <th>天数</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in workingMealData" :key="i" :class="item.className">
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td>
            <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(i + 1, '.workingMealTable', 1, 2, 3)"
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
  name: 'workingMeal',
  props: ['workingMealData'],
  methods: {
    handleInputNum(e) {
      sch.scheduleHandleInputNum(e);
    },
    scheduleCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('workingMealSum', [5, sch.sumCalculate(3, '.workingMealTable')]);
    },
  },
};
</script>

<style scoped>

</style>
