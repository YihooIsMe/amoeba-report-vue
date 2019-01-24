<template>
    <div class="welfareFee">
      <table class="welfareFeeTable" v-if="welfareFeeTableData.length>0" border="1">
        <thead>
        <tr>
          <th></th>
          <th>数额</th>
          <th>人数</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in welfareFeeTableData" :key="i" :class="item.className">
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td>
            <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(welfareFeeTableData.length, '.welfareFeeTable', 1, 2, 3)"
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
  name: 'welfareFee',
  props: ['welfareFeeTableData'],
  methods: {
    handleInputNum(e) {
      sch.scheduleHandleInputNum(e);
    },
    scheduleCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('welfareFeeSum', [4, sch.sumCalculate(3, '.welfareFeeTable')]);
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.welfareFeeLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
  },
  watch: {
    isLoadCompleted() {
      this.scheduleCalculation(this.welfareFeeTableData.length, '.welfareFeeTable', 1, 2, 3);
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$store.commit('setWelfareFeeLoadCompleted', true);
    });
  },
};
</script>

<style scoped lang="less">
  .welfareFeeTable td:nth-child(3){
    padding-left: 0;
    input{
      text-indent: 10px;
    }
  }
</style>
