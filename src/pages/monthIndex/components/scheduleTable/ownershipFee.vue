<template>
    <div class="ownershipFee">
      <table class="ownershipFeeTable" v-if="ownershipFeeData.length>0" border="1">
        <thead>
        <tr>
          <th>类别</th>
          <th>计价</th>
          <th>说明</th>
          <th>人数/件数/人次/金额</th>
          <th>总计</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in ownershipFeeData" :key="index" :class="item.className">
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td>{{item.Description}}</td>
          <td>
            <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(index + 1, '.ownershipFeeTable', 1, 3, 4)"
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
  name: 'ownershipFee',
  props: ['ownershipFeeData'],
  methods: {
    handleInputNum(e) {
      sch.scheduleHandleInputNum(e);
    },
    scheduleCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('ownershipFeeSum', [0, sch.sumCalculate(4, '.ownershipFeeTable')]);
    },
  },
};
</script>

<style lang="less" scoped>

</style>
