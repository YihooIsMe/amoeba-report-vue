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
          <template v-if="item.IsRead === 2">
            <td><div>{{item.Name}}</div></td>
            <td colspan="2">
              <input type="text"
                     :value="item.Amount"
                     @change="scheduleCalculation(workingMealData, '.workingMealTable', 0, 1, 2, $event)"
                     :disabled="inputDisabled"/>
            </td>
            <td><input type="text" disabled/></td>
          </template>
          <template v-else>
            <td><div>{{item.Name}}</div></td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(workingMealData, '.workingMealTable', 0, 1, 2, $event)"
                     :value="item.IsRead === 3 ?item.Description:item.Valuation"
                     :readonly="item.IsRead === 1||item.IsRead === 3"
                     :disabled="inputDisabled"
              />
            </td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(workingMealData, '.workingMealTable', 0, 1, 2, $event)"
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
  name: 'workingMeal',
  props: ['workingMealData'],
  methods: {
    commonCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('workingMealSum', [5, sch.sumCalculate('.workingMealTable')]);
    },
    scheduleCalculation(a, b, c, d, e, f) {
      sch.scheduleHandleInputNum(f);
      this.commonCalculation(a, b, c, d, e);
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
      this.commonCalculation(this.workingMealData, '.workingMealTable', 0, 1, 2);
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

</style>
