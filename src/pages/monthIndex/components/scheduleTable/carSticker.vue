<template>
    <div class="carSticker">
      <table class="carStickerTable" v-if="carStickerData.length>0" border="1">
        <thead>
        <tr>
          <th>职称</th>
          <th>数额</th>
          <th>人数</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in carStickerData" :key="i" :class="item.className">
          <template v-if="item.IsRead === 2">
            <td><div>{{item.Name}}</div></td>
            <td colspan="2">
              <input type="text"
                     @keyup="handleInputNum"
                     :value="item.Amount"
                     @change="scheduleCalculation(carStickerData, '.carStickerTable', 0, 1, 2)"
                     :disabled="inputDisabled || currentDisabled"/>
            </td>
            <td><input type="text" disabled/></td>
          </template>
          <template v-else>
            <td><div>{{item.Name}}</div></td>
            <td>
              <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(carStickerData, '.carStickerTable', 0, 1, 2)"
                     :value="item.IsRead === 3 ?item.Description:item.Valuation"
                     :readonly="item.IsRead === 1||item.IsRead === 3"
                     :disabled="inputDisabled"
              />
            </td>
            <td>
              <input type="text"
                     @keyup="handleInputNum"
                     @change="scheduleCalculation(carStickerData, '.carStickerTable', 0, 1, 2)"
                     :value="$store.state.comData.commonData.draft === 1 ? item.Amount : ''"
                     :disabled="inputDisabled || currentDisabled"
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
  name: 'carSticker',
  props: ['carStickerData'],
  data() {
    return {
      seniorDirectorClassName: ['FC2', 'FC3', 'FC4'], // 高级主任的className
      currentDisabled: true,
    };
  },
  methods: {
    handleInputNum(e) {
      sch.scheduleHandleInputNum(e);
    },
    scheduleCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('carStickerSum', [6, sch.sumCalculate('.carStickerTable')]);
    },
    setCarStickerPeople() {
      //  因为三地高级主任和主任的类别都一样,直接写死了,如果后面有变动需要重新手动调整代码;
      //  固定工资店主管人数
      const fixedSalaryStoreManager = Number(document.querySelector('.fixedSalaryTable>tbody>tr.FC0>td:nth-child(3)>input').value);
      //  固定工资高级主任人数
      let fixedSalarySeniorDirector = 0;
      this.seniorDirectorClassName.forEach((el) => {
        fixedSalarySeniorDirector = Number(document.querySelector('.fixedSalaryTable>tbody>tr.' + el + '>td:nth-child(3)>input').value) + fixedSalarySeniorDirector;
      });
      //  固定工资主任人数
      const fixedDirector = Number(document.querySelector('.fixedSalaryTable>tbody>tr.FC5>td:nth-child(3)>input').value);
      document.querySelector('.carStickerTable>tbody>tr.FG0>td:nth-child(3)>input').value = fixedSalaryStoreManager;
      document.querySelector('.carStickerTable>tbody>tr.FG1>td:nth-child(3)>input').value = fixedSalarySeniorDirector + fixedDirector;
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.carStickerLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
    scheduleTabIndex() {
      return this.$store.state.scheduleForm.scheduleTabIndex;
    },
  },
  watch: {
    isLoadCompleted() {
      this.scheduleCalculation(this.carStickerData, '.carStickerTable', 0, 1, 2);
    },
    scheduleTabIndex(val) {
      if (val === 6) {
        this.setCarStickerPeople();
        this.scheduleCalculation(this.carStickerData, '.carStickerTable', 0, 1, 2);
      }
    },
  },
  updated() {
    this.$nextTick(() => {
      this.$store.commit('setCarStickerLoadCompleted', true);
    });
  },
};
</script>

<style scoped lang="less">
.carStickerTable table td{

}
</style>
