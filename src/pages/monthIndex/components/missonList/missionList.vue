<template>
  <div class="mission-list">
    <ul class="weeks">
      <li v-for="n in 4" :key="n">
        <el-button
          type="warning"
          :plain="!showMission[n - 1]"
          @click="getIndex(n)"
        >第{{n}}周</el-button>
      </li>
    </ul>
    <MissionTextarea :weekData="firstWeekData" v-show="showMission[0]"></MissionTextarea>
    <MissionTextarea :weekData="secondWeekData" v-show="showMission[1]"></MissionTextarea>
    <MissionTextarea :weekData="thirdWeekData" v-show="showMission[2]"></MissionTextarea>
    <MissionTextarea :weekData="fourthWeekData" v-show="showMission[3]"></MissionTextarea>
    <MaskLayer></MaskLayer>
  </div>
</template>

<script>
import Vue from 'vue';
import MissionTextarea from './missionTextarea.vue';
import MaskLayer from './maskLayer.vue';


export default {
  name: 'missionList',
  components: { MissionTextarea, MaskLayer },
  data() {
    return {
      showMission: [true, false, false, false],
      firstWeekData: {
        index: 1,
        identity: this.isStore ? 'store' : 'district', // 'store'代表门店;其他的代表非门店;
        first: '',
        second: '',
        third: '',
        fourth: '',
        fifth: '',
        sixth: '',
      },
      secondWeekData: {
        index: 2,
        identity: this.isStore ? 'store' : 'district',
        first: '',
        second: '',
        third: '',
        fourth: '',
        fifth: '',
        sixth: '',
      },
      thirdWeekData: {
        index: 3,
        identity: this.isStore ? 'store' : 'district',
        first: '',
        second: '',
        third: '',
        fourth: '',
        fifth: '',
        sixth: '',
      },
      fourthWeekData: {
        index: 4,
        identity: this.isStore ? 'store' : 'district',
        first: '',
        second: '',
        third: '',
        fourth: '',
        fifth: '',
        sixth: '',
      },
      missionListData: this.$store.state.missionList,
      weekData: ['firstWeekData', 'secondWeekData', 'thirdWeekData', 'fourthWeekData'],
      Amoeba_TaskForm: [],
      isStore: this.$store.state.comData.commonData.Pr0111 === 'A1' || this.$store.state.comData.commonData.Pr0111 === 'B0' || this.$store.state.comData.commonData.Pr0111 === 'C',
    };
  },
  methods: {
    getIndex(index) {
      this.showMission.forEach((el, i) => {
        Vue.set(this.showMission, i, false);
      });
      Vue.set(this.showMission, index - 1, true);
    },
    editorSubmission() {
      this.Amoeba_TaskForm = [];
      const PreordainID = this.$store.state.comData.commonData.MPID;
      for (let i = 0; i < 4; i += 1) {
        const editorObj = {};
        editorObj.ID = '';
        editorObj.PreordainID = PreordainID;
        editorObj.Week_ = i + 1;
        editorObj.Identity_ = this.isStore ? 'store' : 'district';
        editorObj.First = this.$store.state.missionList[this.weekData[i]].first;
        editorObj.Second = this.$store.state.missionList[this.weekData[i]].second;
        editorObj.Third = this.$store.state.missionList[this.weekData[i]].third;
        editorObj.Fourth = this.$store.state.missionList[this.weekData[i]].fourth;
        editorObj.Fifth = this.$store.state.missionList[this.weekData[i]].fifth;
        editorObj.Sixth = this.$store.state.missionList[this.weekData[i]].sixth;
        this.Amoeba_TaskForm.push(editorObj);
      }
      this.$store.commit('setMissionListData', this.Amoeba_TaskForm);
    },
    missionListLoading() {
      const PreordainID = this.$store.state.comData.commonData.MPID;
      console.log({ PreordainID });
      this.$api.monthMissionList({ PreordainID })
        .then((res) => {
          console.log(JSON.parse(res.data));
          if (JSON.parse(res.data).length > 0) {
            JSON.parse(res.data).forEach((el, i) => {
              Vue.set(this[this.weekData[i]], 'index', el.Week_);
              Vue.set(this[this.weekData[i]], 'identity', el.Identity_);
              Vue.set(this[this.weekData[i]], 'first', el.First);
              Vue.set(this[this.weekData[i]], 'second', el.Second);
              Vue.set(this[this.weekData[i]], 'third', el.Third);
              Vue.set(this[this.weekData[i]], 'fourth', el.Fourth);
              Vue.set(this[this.weekData[i]], 'fifth', el.Fifth);
              Vue.set(this[this.weekData[i]], 'sixth', el.Sixth);
            });
          }
        })
        .catch((errMsg) => {
          console.log(errMsg);
        });
    },
  },
  // note:下面的computed和watch非常重要,不加上会导致填写富文本数据不刷新;
  computed: {
    // storeFirstWeekData() {
    //   return this.$store.state.missionList.firstWeekData;
    // },
    // storeSecondWeekData() {
    //   return this.$store.state.missionList.secondWeekData;
    // },
    // storeThirdWeekData() {
    //   return this.$store.state.missionList.thirdWeekData;
    // },
    // storeFourthWeekData() {
    //   return this.$store.state.missionList.fourthWeekData;
    // },
  },
  watch: {
    // 'storeFirstWeekData.first': function () {
    // },
    // 'storeFirstWeekData.second': function () {
    // },
    // 'storeFirstWeekData.third': function () {
    // },
    // 'storeFirstWeekData.fourth': function () {
    // },
    // 'storeFirstWeekData.fifth': function () {
    // },
    // 'storeFirstWeekData.sixth': function () {
    // },
    // 'storeSecondWeekData.first': function () {
    // },
    // 'storeSecondWeekData.second': function () {
    // },
    // 'storeSecondWeekData.third': function () {
    // },
    // 'storeSecondWeekData.fourth': function () {
    // },
    // 'storeSecondWeekData.fifth': function () {
    // },
    // 'storeSecondWeekData.sixth': function () {
    // },
    // 'storeThirdWeekData.first': function () {
    // },
    // 'storeThirdWeekData.second': function () {
    // },
    // 'storeThirdWeekData.third': function () {
    // },
    // 'storeThirdWeekData.fourth': function () {
    // },
    // 'storeThirdWeekData.fifth': function () {
    // },
    // 'storeThirdWeekData.sixth': function () {
    // },
    // 'storeFourthWeekData.first': function () {
    // },
    // 'storeFourthWeekData.second': function () {
    // },
    // 'storeFourthWeekData.third': function () {
    // },
    // 'storeFourthWeekData.fourth': function () {
    // },
    // 'storeFourthWeekData.fifth': function () {
    // },
    // 'storeFourthWeekData.sixth': function () {
    // },
  },
};
</script>

<style lang="less" scoped>
.mission-list{
  position: relative;
  min-height: 80px;
  border: 1px solid transparent;
  .weeks{
    position: absolute;
    padding: 0;
    left:50%;
    margin-left: -318px;
    li{
      list-style: none;
      float: left;
      margin-left: 100px;
    }
    li:first-child{
      margin-left: 0;
    }
  }
}
</style>
