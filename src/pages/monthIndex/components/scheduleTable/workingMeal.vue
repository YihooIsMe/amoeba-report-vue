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
                     @change="scheduleCalculation(workingMealData.length, '.workingMealTable', 1, 2, 3)"
                     :value="$store.state.comData.commonData.draft === 1 ? item.Amount : ''"
                   :disabled="inputDisabled"
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
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.workingMealLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
  },
  watch: {
    isLoadCompleted() {
      this.scheduleCalculation(this.workingMealData.length, '.workingMealTable', 1, 2, 3);
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$store.commit('setWorkingMealLoadCompleted', true);
    });
  },
};
</script>

<style scoped lang="less">
.workingMealTable td:nth-child(3){
  padding-left: 0;
  input{
    text-indent: 10px;
  }
}
</style>
