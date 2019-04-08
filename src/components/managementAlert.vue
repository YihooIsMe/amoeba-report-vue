<template>
  <div class="managementAlert">
    <div class="alertParent">
      <div class="alertContent">
        <div class="title">请选择门店等级</div>
        <div class="close" @click="closeManagement">×</div>
        <div class="select">
          <select id="qyjVal" v-model="selected">
            <option value="0.15">A</option>
            <option value="0.125">B</option>
            <option value="0.1">C</option>
            <option value="0.075">D</option>
            <template v-if="city === '001'">
              <option value="0.03">E</option>
            </template>
            <template v-else>
              <option value="0.05">E</option>
            </template>
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
  props: ['alertIndex', 'SigningRatio', 'applyWhere', 'City'],
  data() {
    return {
      selected: '0.15',
      city: '',
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
  computed: {
    getCityNumber() {
      if (this.applyWhere === 'monthIndex') {
        return this.$store.state.comData.commonData.City;
      }
      if (this.applyWhere === 'yearIndex') {
        return this.City;
      }
      return '';
    },
  },
  watch: {
    alertIndex(newVal) {
      switch (true) {
        case this.applyWhere === 'yearIndex':
          this.selected = this.SigningRatio['SigningRatio' + (newVal - 2)];
          break;
        case this.applyWhere === 'monthIndex':
          this.selected = this.SigningRatio;
          break;
        default:
      }
    },
    getCityNumber(val) {
      this.city = val;
    },
  },
};
</script>
