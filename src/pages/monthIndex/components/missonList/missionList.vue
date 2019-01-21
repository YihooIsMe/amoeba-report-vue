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
  </div>
</template>

<script>
import Vue from 'vue';
import MissionTextarea from './missionTextarea.vue';

export default {
  name: 'missionList',
  components: { MissionTextarea },
  data() {
    return {
      showMission: [true, false, false, false],
      firstWeekData: {
        index: 1,
        identity: 'store', // 1代表门店;2代表区域.如:上海业务一区 2; 瑞虹一店 1;
        first: '<p>我是来自第一周的数据</p>',
        second: '',
        third: '',
        fourth: '',
        fifth: '',
        sixth: '',
      },
      secondWeekData: {
        index: 2,
        identity: 'district',
        first: '<p>我是来自第二周的数据</p>',
        second: '',
        third: '',
        fourth: '',
        fifth: '',
        sixth: '',
      },
      thirdWeekData: {
        index: 3,
        identity: 'store',
        first: '<p>我是来自第三周的数据</p>',
        second: '',
        third: '',
        fourth: '',
        fifth: '',
        sixth: '',
      },
      fourthWeekData: {
        index: 4,
        identity: 'district',
        first: '<p>我是来自第四周的数据</p>',
        second: '',
        third: '',
        fourth: '',
        fifth: '',
        sixth: '',
      },
    };
  },
  methods: {
    getIndex(index) {
      this.showMission.forEach((el, i) => {
        Vue.set(this.showMission, i, false);
      });
      Vue.set(this.showMission, index - 1, true);
    },
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
