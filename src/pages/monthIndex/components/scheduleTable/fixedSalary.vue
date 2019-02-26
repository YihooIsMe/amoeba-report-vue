<template>
    <div class="fixedSalary">
      <table class="fixedSalaryTable" v-if="fixedSalaryData.length>0" border="1">
        <thead>
        <tr>
          <th>职称</th>
          <th>固定薪资</th>
          <th>人数</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in fixedSalaryData" :key="i" :class="item.className">
          <template v-if="item.IsRead === 2">
            <td><div>{{item.Name}}</div></td>
            <td colspan="2">
              <input type="text"
                     :value="item.Amount"
                     @change="scheduleCalculation(fixedSalaryData, '.fixedSalaryTable', 0, 1, 2, $event)"
                     :disabled="inputDisabled"/>
            </td>
            <td><input type="text" disabled/></td>
          </template>
          <template v-else>
            <td><div>{{item.Name}}</div></td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(fixedSalaryData, '.fixedSalaryTable', 0, 1, 2, $event)"
                     :value="item.IsRead === 3 ?item.Description:item.Valuation"
                     :readonly="item.IsRead === 1||item.IsRead === 3"
                     :disabled="inputDisabled"
              />
            </td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(fixedSalaryData, '.fixedSalaryTable', 0, 1, 2, $event)"
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
      <div class="schedule-note red">其他调整项：如福利补贴，伙食津贴，全国证加给，秘书绩效津贴、奖惩加扣</div>
    </div>
</template>

<script>
import cal from '@/assets/js/comCalculation';
import sch from '@/assets/js/scheduleTableCalculation';

export default {
  name: 'fixedSalary',
  props: ['fixedSalaryData'],
  methods: {
    commonCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('fixedSalarySum', [2, sch.sumCalculate('.fixedSalaryTable')]);
    },
    socialOrProvidentTotal(type) {
      cal.whereUse('monthIndex');
      cal.getCity(this.$store.state.comData.commonData.City);
      cal.judgeDepartment(this.$store.state.comData.commonData.Pr0111);
      if (type === 'social') {
        cal.setSocialInsurancePremium(sch.socialOrProvidentSumCalculation(this.fixedSalaryData, type));
      }
      if (type === 'provident') {
        cal.setProvidentFundPeople(sch.socialOrProvidentSumCalculation(this.fixedSalaryData, type));
      }
    },
    scheduleCalculation(a, b, c, d, e, f) {
      sch.scheduleHandleInputNum(f);
      sch.setCalculatedPeopleNumber();
      this.commonCalculation(a, b, c, d, e);
      // 下面两行代码必须在下面;否则的话计算公积金和社会保险金会漏算最后一次的;
      this.socialOrProvidentTotal('social');
      this.socialOrProvidentTotal('provident');
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.fixedSalaryLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
  },
  watch: {
    isLoadCompleted() {
      this.commonCalculation(this.fixedSalaryData, '.fixedSalaryTable', 0, 1, 2);
      // 下面两行代码不能放到this.commonCalculation()前面;因为取的是预估值这一栏,必须要先计算,否则的话就为0;this.commonCalculation()方法中有计算必须放在前面;
      this.socialOrProvidentTotal('social');
      this.socialOrProvidentTotal('provident');
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$store.commit('setFixedSalaryLoadCompleted', true);
    });
  },
};
</script>

<style scoped lang="less">

</style>
