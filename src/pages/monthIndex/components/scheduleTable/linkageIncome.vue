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
          <template v-if="item.IsRead === 2">
            <td><div>{{item.Name}}</div></td>
            <td colspan="2">
              <input type="text"
                     :value="item.Amount"
                     @change="scheduleCalculation(linkageIncomeData, '.linkageIncomeTable', 0, 1, 2, $event)"
                     :disabled="inputDisabled"/>
            </td>
            <td><input type="text" disabled/></td>
          </template>
          <template v-else>
            <td><div>{{item.Name}}</div></td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(linkageIncomeData, '.linkageIncomeTable', 0, 1, 2, $event)"
                     :value="item.Valuation"
                     :readonly="item.IsRead === 1||item.IsRead === 3"
                     :disabled="inputDisabled"
              />
            </td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(linkageIncomeData, '.linkageIncomeTable', 0, 1, 2, $event)"
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
  name: 'linkageIncome',
  props: ['linkageIncomeData'],
  methods: {
    commonCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('linkageIncomeSum', [1, sch.sumCalculate('.linkageIncomeTable')]);
    },
    scheduleCalculation(a, b, c, d, e, f) {
      sch.scheduleHandleInputNum(f);
      this.commonCalculation(a, b, c, d, e);
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.linkageIncomeLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
  },
  watch: {
    isLoadCompleted() {
      this.commonCalculation(this.linkageIncomeData, '.linkageIncomeTable', 0, 1, 2);
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$store.commit('setLinkageIncomeLoadCompleted', true);
    });
  },
};
</script>

<style lang="less" scoped>

</style>
