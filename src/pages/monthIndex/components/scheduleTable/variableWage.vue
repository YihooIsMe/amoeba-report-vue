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
            <td>{{item.Name}}</td>
            <td colspan="2">
              <input type="text"
                     @keyup="handleInputNum"
                     :value="item.Valuation"
                     @change="scheduleCalculation(variableWageData, '.variableWageTable', 0, 1, 2)"
                     :disabled="inputDisabled"/>
            </td>
            <td><input type="text" disabled/></td>
          </template>
          <template v-else>
            <td>{{item.Name}}</td>
            <td>
              <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(variableWageData, '.variableWageTable', 0, 1, 2)"
                     :value="item.Valuation"
                     :readonly="item.IsRead === 1||item.IsRead === 3"
                     :disabled="inputDisabled"
              />
            </td>
            <td>
              <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(variableWageData, '.variableWageTable', 0, 1, 2)"
                     :value="$store.state.comData.commonData.draft === 1 ? item.Amount : ''"
                     :disabled="inputDisabled"
              />
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
  name: 'variableWage',
  props: ['variableWageData'],
  methods: {
    handleInputNum(e) {
      sch.scheduleHandleInputNum(e);
    },
    scheduleCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('variableWageSum', [3, sch.sumCalculate('.variableWageTable')]);
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.variableWageLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
  },
  watch: {
    isLoadCompleted() {
      this.scheduleCalculation(this.variableWageData, '.variableWageTable', 0, 1, 2);
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
  .variableWageTable td:nth-child(3){
    padding-left: 0;
    input{
      text-indent: 10px;
    }
  }
</style>
