<template>
  <div class="managementAlert">
    <div class="alertParent">
      <div class="alertContent">
        <div class="title">请选择签约金类型</div>
        <div class="close" @click="closeManagement">×</div>
        <div class="select">
          <select id="qyjVal" v-model="selected">
            <option value="0.1">A</option>
            <option value="0.075">B</option>
            <option value="0.05">C</option>
            <option value="0.025">D</option>
            <option value="0">E</option>
          </select>
        </div>
        <div class="bottomBtn">
          <a class="sureBtn" @click="getSelectedNum">确定</a>
          <a class="cancelBtn" @click="closeManagement">取消</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'managementAlert',
  props: ['alertIndex', 'SigningRatio'],
  data() {
    return {
      selected: '0.1',
    };
  },
  methods: {
    closeManagement() {
      this.$emit('changeAlertShow');
    },

    getSelectedNum() {
      this.$emit('giveSelectedNum', Number(this.selected));
    },
  },
  watch: {
    alertIndex(newVal) {
      this.selected = this.SigningRatio['SigningRatio' + (newVal - 2)];
    },
  },
};
</script>
