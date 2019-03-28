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
                     :value="item.Amount"
                     @change="scheduleCalculation(carStickerData, '.carStickerTable', 0, 1, 2, $event)"
                     :disabled="inputDisabled || currentDisabled"/>
            </td>
            <td><input type="text" disabled/></td>
          </template>
          <template v-else>
            <td><div>{{item.Name}}</div></td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(carStickerData, '.carStickerTable', 0, 1, 2, $event)"
                     :value="item.IsRead === 3 ?item.Description:item.Valuation"
                     :readonly="item.IsRead === 1||item.IsRead === 3"
                     :disabled="inputDisabled"
              />
            </td>
            <td>
              <input type="text"
                     @change="scheduleCalculation(carStickerData, '.carStickerTable', 0, 1, 2, $event)"
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
      seniorDirectorClassName: ['FC12', 'FC1', 'FC2', 'FC3', 'FC4', 'FC5'],
      currentDisabled: true,
    };
  },
  methods: {
    commonCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('carStickerSum', [6, sch.sumCalculate('.carStickerTable')]);
    },
    scheduleCalculation(a, b, c, d, e, f) {
      sch.scheduleHandleInputNum(f);
      this.commonCalculation(a, b, c, d, e);
    },
    setCarStickerPeople() {
      const fixedSalaryStoreManager = Number(document.querySelector('.fixedSalaryTable>tbody>tr.FC0>td:nth-child(3)>input').value);
      let fixedSalarySeniorDirector = 0;
      this.seniorDirectorClassName.forEach((el) => {
        fixedSalarySeniorDirector = Number(document.querySelector('.fixedSalaryTable>tbody>tr.' + el + '>td:nth-child(3)>input').value) + fixedSalarySeniorDirector;
      });
      document.querySelector('.carStickerTable>tbody>tr.FG0>td:nth-child(3)>input').value = fixedSalaryStoreManager;
      document.querySelector('.carStickerTable>tbody>tr.FG1>td:nth-child(3)>input').value = fixedSalarySeniorDirector;
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.carStickerLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
    isSumFixedSalary() {
      return this.$store.state.scheduleForm.sumScheduleForm.sumFixedSalary;
    },
  },
  watch: {
    isLoadCompleted() {
      this.commonCalculation(this.carStickerData, '.carStickerTable', 0, 1, 2);
    },
    isSumFixedSalary() {
      this.setCarStickerPeople();
      this.commonCalculation(this.carStickerData, '.carStickerTable', 0, 1, 2);
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
