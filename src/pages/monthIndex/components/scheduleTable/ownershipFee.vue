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
          <template>
            <td><div>{{item.Name}}</div></td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(ownershipFeeData, '.ownershipFeeTable', 0, 1, 2, $event)"
                     :value="item.Valuation"
                     :readonly="item.IsRead === 1||item.IsRead === 3"
                     :disabled="inputDisabled"
              />
            </td>
            <td><div>{{item.Description}}</div></td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(ownershipFeeData, '.ownershipFeeTable', 0, 1, 2, $event)"
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
  name: 'ownershipFee',
  props: ['ownershipFeeData'],
  methods: {
    commonCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('ownershipFeeSum', [0, sch.sumCalculate('.ownershipFeeTable')]);
    },
    scheduleCalculation(a, b, c, d, e, f) {
      sch.scheduleHandleInputNum(f);
      this.commonCalculation(a, b, c, d, e);
    },
  },
  computed: {
    isOwnershipFeeLoadCompleted() {
      return this.$store.state.scheduleForm.ownershipFeeLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
  },
  watch: {
    isOwnershipFeeLoadCompleted() {
      this.commonCalculation(this.ownershipFeeData, '.ownershipFeeTable', 0, 1, 2);
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$store.commit('setOwnershipFeeLoadCompleted', true);
    });
  },
};
</script>

<style lang="less" scoped>

</style>
