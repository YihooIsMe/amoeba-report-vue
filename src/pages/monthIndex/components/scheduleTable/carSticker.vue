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
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td>
            <input type="text"
                   @keyup="handleInputNum"
                   @change="scheduleCalculation(carStickerData.length, '.carStickerTable', 1, 2, 3)"
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
  name: 'carSticker',
  props: ['carStickerData'],
  methods: {
    handleInputNum(e) {
      sch.scheduleHandleInputNum(e);
    },
    scheduleCalculation(a, b, c, d, e) {
      sch.calculation(a, b, c, d, e);
      this.$emit('carStickerSum', [6, sch.sumCalculate(3, '.carStickerTable')]);
    },
  },
  computed: {
    isLoadCompleted() {
      return this.$store.state.scheduleForm.carStickerLoadCompleted;
    },
    inputDisabled() {
      return this.$store.state.comData.inputDisabled;
    },
  },
  watch: {
    isLoadCompleted() {
      this.scheduleCalculation(this.carStickerData.length, '.carStickerTable', 1, 2, 3);
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
  .carStickerTable td:nth-child(3) {
    padding-left: 0;
    input{
      text-indent: 10px;
    }
  }
</style>
