<template>
  <div class="districtSchedule">
    <ul class="districtScheduleUl">
      <li v-for="(item, i) in tabList" :class="{active : activeArr[i]}" :key="i" @click="setTabIndex(i)">{{item.Name}}<br><input type="text" v-model="item.modelVal" readonly /></li>
    </ul>
    <div v-show="tabIndex === 0">
      <SigningFeeAdjustment></SigningFeeAdjustment>
    </div>
    <div v-show="tabIndex ===1">
      <ChangeBonus></ChangeBonus>
    </div>
    <div v-show="tabIndex ===2">
      <WithholdingBonus></WithholdingBonus>
    </div>
    <div v-show="tabIndex ===3">
      <BusinessAdjustment></BusinessAdjustment>
    </div>
    <div v-show="tabIndex ===4">
      <WelfareFee></WelfareFee>
    </div>
  </div>
</template>

<script>
import SigningFeeAdjustment from './signingFeeAdjustment.vue';
import ChangeBonus from './changeBonus.vue';
import WithholdingBonus from './withholdingBonusAdjustment.vue';
import BusinessAdjustment from './businessAdjustment.vue';
import WelfareFee from './welfareFee.vue';

export default {
  name: 'index',
  components: {
    SigningFeeAdjustment,
    ChangeBonus,
    WithholdingBonus,
    BusinessAdjustment,
    WelfareFee,
  },
  data() {
    return {
      tabIndex: 0,
      activeArr: [true, false, false, false],
      tabList: [
        { Name: '签约金调整', modelVal: 0, type: 'sumSigningFeeAdjustment' },
        { Name: '变动奖金', modelVal: 0, type: 'sumChangeBonus' },
        { Name: '预提奖金', modelVal: 0, type: 'sumWithholdingBonus' },
        { Name: '业绩调整', modelVal: 0, type: 'sumBusinessAdjustment' },
        { Name: '福利费', modelVal: 0, type: 'sumWelfareFee' },
      ],
    };
  },
  methods: {
    setTabIndex(i) {
      this.tabIndex = i;
      this.activeArr = [false, false, false, false];
      this.activeArr.splice(i, 1, true);
    },
  },
};
</script>

<style lang="less" scoped>
  .districtSchedule{
    position: relative;
    border:1px solid transparent;
    padding-top:100px;
    ul{
      position: absolute;
      top:20px;
      left:50%;
      padding-left: 0;
      margin-left: -275px;
      li{
        list-style: none;
        float: left;
        width: 100px;
        text-align: center;
        background-color: white;
        color:#1E9FFF;
        border:1px solid #1E9FFF;
        margin-left:10px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        cursor: pointer;
        input{
          width: 90%;
          height:25px !important;
          border:none;
          background-color: white;
          outline:none;
          text-align: center;
          color:#1E9FFF;
          font-size:18px;
          cursor: pointer;
        }
      }
      li:first-child{
        margin-left: 0;
      }
    }
    ul:after{
      content: '';
      display: table;
      clear: both;
    }
  }
  .active{
    background-color:#1E9FFF !important;
    color:white !important;
    input{
      background-color:#1E9FFF !important;
      color:white !important;
    }
  }
</style>
<style>
  .districtSchedule>div>div{
    width: 80%;
    margin: auto;
  }
</style>
