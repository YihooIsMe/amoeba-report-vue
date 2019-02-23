<template>
  <div class="districtSchedule">
    <ul class="districtScheduleUl">
      <li v-for="(item, i) in tabList" :class="{active : activeArr[i]}" :key="i" @click="setTabIndex(i)">{{item.Name}}<br><input type="text" v-model="item.modelVal" readonly /></li>
    </ul>
    <div v-show="tabIndex === 0">
      <SigningFeeAdjustment
        :inputDisabled="inputDisabled"
        ref="signingFeeAdjustment"
        :signingFeeAdjustment="signingFeeAdjustment"
        @giveSumSigningFeeAdjustment="getSumSigningFeeAdjustment"></SigningFeeAdjustment>
    </div>
    <div v-show="tabIndex === 1">
      <ChangeBonus
        :inputDisabled="inputDisabled"
        @giveSumChangeBonus="getSumChangeBonus"
        :changeBonusList="changeBonusList"></ChangeBonus>
    </div>
    <div v-show="tabIndex === 2">
      <WithholdingBonus
        :withholdingBonusDeduction="withholdingBonusDeduction"
        :withholdingBonusIncrement="withholdingBonusIncrement"
        :withholdingBonus="withholdingBonus"></WithholdingBonus>
    </div>
    <div v-show="tabIndex === 3">
      <BusinessAdjustment
        :inputDisabled="inputDisabled"
        :businessAdjustment="businessAdjustment"
        ref="businessAdjustment"
        @giveSumBusinessAdjustment="getSumBusinessAdjustment"></BusinessAdjustment>
    </div>
    <div v-show="tabIndex === 4">
      <WelfareFee
        ref="welfareFee"
        :inputDisabled="inputDisabled"
        @giveSumWelfareFee="getSumWelfareFee"
        :welfareFeeList="welfareFeeList"></WelfareFee>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SigningFeeAdjustment from './signingFeeAdjustment.vue';
import ChangeBonus from './changeBonus.vue';
import WithholdingBonus from './withholdingBonusAdjustment.vue';
import BusinessAdjustment from './businessAdjustment.vue';
import WelfareFee from './welfareFee.vue';
import news from '@/assets/js/notification';
import api from '@/http/index';

Vue.use(api);

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
      signingFeeAdjustment: [],
      businessAdjustment: [],
      changeBonusList: [],
      withholdingBonusDeduction: [],
      withholdingBonusIncrement: [],
      withholdingBonus: [],
      sumWithholdingBonusArr: [],
      sumWithholdingBonus: '',
      welfareFeeList: [],
      inputDisabled: this.$store.state.comData.inputDisabled,
    };
  },
  methods: {
    setTabIndex(i) {
      this.tabIndex = i;
      this.activeArr = [false, false, false, false];
      this.activeArr.splice(i, 1, true);
    },
    getStoreRequest() {
      const ParentId = this.$store.state.comData.commonData.OrganizeId;
      this.$api.queryAndAddedUserInfo({ ParentId })
        .then((res) => {
          console.log(JSON.parse(res.data));
          this.$store.commit('setStoreList', JSON.parse(res.data));
        })
        .catch((errMsg) => {
          console.log(errMsg);
        });
    },
    districtRequest() {
      const OrganizationID = this.$store.state.comData.commonData.OrganizeId;
      const MonthlyPlanID = this.$store.state.comData.commonData.MPID;
      const years = news.injectYearAndMonth().Years;
      let month = news.injectYearAndMonth().Month;
      if (month < 10) {
        month = '0' + month;
      }
      const yearsAndMonth = years + month;
      const City = this.$store.state.comData.commonData.City;
      this.$api.monthScheduleTable({
        MonthlyPlanID,
        years: yearsAndMonth,
        OrganizationID,
        City,
      }).then((res) => {
        console.log(JSON.parse(res.data));
        JSON.parse(res.data).MonthAreaFB.forEach((item) => {
          switch (item.Type) {
            case 0:
              this.changeBonusList.push(item);
              break;
            case 1:
              this.withholdingBonusDeduction.push(item);
              this.sumWithholdingBonusArr.push(item.Amount);
              break;
            case 2:
              this.withholdingBonusIncrement.push(item);
              this.sumWithholdingBonusArr.push(item.Amount);
              break;
            case 3:
              this.welfareFeeList.push(item);
              break;
            default:
          }
        });
        JSON.parse(res.data).AdjustmentList.forEach((item) => {
          switch (item.Type) {
            case 0:
              this.signingFeeAdjustment.push(item);
              break;
            case 1:
              this.businessAdjustment.push(item);
              break;
            default:
          }
        });
        this.withholdingBonus = JSON.parse(res.data).MonthAreaYTJJ;
        this.sumWithholdingBonus = Math.round(this.sumWithholdingBonusArr.reduce((total, num) => total + num, 0));
      }).catch((err) => {
        console.log(err);
        news.ElErrorMessage(err);
      });
    },
    getDistrictScheduleSubmissionData() {
      const MonthAreaFB = [];
      this.changeBonusList.forEach((item) => {
        const obj = {};
        obj.ID = item.ID;
        obj.Amount = Number(item.Amount);
        MonthAreaFB.push(obj);
      });
      this.welfareFeeList.forEach((item) => {
        const obj = {};
        obj.ID = item.ID;
        obj.Amount = Number(item.Amount);
        MonthAreaFB.push(obj);
      });
      this.$store.commit('setMonthAreaFB', MonthAreaFB);
      this.$refs.signingFeeAdjustment.getSigningFeeAdjustmentData();
      this.$refs.businessAdjustment.getBusinessAdjustment();
    },
    getSumSigningFeeAdjustment(val) {
      Vue.set(this.tabList[0], 'modelVal', val);
      this.$store.commit('setSumDistrictSchedule', { type: 'sumSigningFeeAdjustment', sumVal: val });
    },
    getSumBusinessAdjustment(val) {
      Vue.set(this.tabList[3], 'modelVal', val);
      this.$store.commit('setSumDistrictSchedule', { type: 'sumBusinessAdjustment', sumVal: val });
    },
    getSumWelfareFee(val) {
      Vue.set(this.tabList[4], 'modelVal', val);
      this.$store.commit('setSumDistrictSchedule', { type: 'sumWelfareFee', sumVal: val });
    },
    getSumChangeBonus(val) {
      Vue.set(this.tabList[1], 'modelVal', val);
      this.$store.commit('setSumDistrictSchedule', { type: 'sumChangeBonus', sumVal: val });
    },
  },
  watch: {
    sumWithholdingBonus(val) {
      Vue.set(this.tabList[2], 'modelVal', val);
      this.$store.commit('setSumDistrictSchedule', { type: 'sumWithholdingBonus', sumVal: val });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getStoreRequest();
    });
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
