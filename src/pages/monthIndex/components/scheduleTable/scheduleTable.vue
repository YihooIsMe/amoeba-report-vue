<template>
  <div class="schedule">
    <ul class="scheduleUl">
      <li v-for="(item, i) in tabList" :key="i" @click="setTabIndex(i)">{{item.Name}}<br><input type="text" v-model="item.modelVal" readonly /></li>
    </ul>
    <div v-show="tabIndex === 0">
      <SelectedOwnershipFee
        :ownershipFeeData="scheduleTableData[0]"
        @ownershipFeeSum="getComponentSum"
        ref="ownershipFee"
      ></SelectedOwnershipFee>
    </div>
    <div v-show="tabIndex === 1">
      <SelectedLinkageIncome
        :linkageIncomeData="scheduleTableData[1]"
        @linkageIncomeSum="getComponentSum"
        ref="linkageIncome"
      ></SelectedLinkageIncome>
    </div>
    <div v-show="tabIndex === 2">
      <SelectedFixedSalary
        :fixedSalaryData="scheduleTableData[2]"
        @fixedSalarySum="getComponentSum"
        ref="fixedSalary"
      ></SelectedFixedSalary>
    </div>
    <div v-show="tabIndex === 3">
      <SelectedVariableWage
        :variableWageData="scheduleTableData[3]"
        :fixedSalaryData="scheduleTableData[2]"
        @variableWageSum="getComponentSum"
        ref="variableWage"
      ></SelectedVariableWage>
    </div>
    <div v-show="tabIndex === 4">
      <SelectedWelfareFee
        :welfareFeeTableData="scheduleTableData[4]"
        :fixedSalaryData="scheduleTableData[2]"
        @welfareFeeSum="getComponentSum"
        ref="welfareFee"
      ></SelectedWelfareFee>
    </div>
    <div v-show="tabIndex === 5">
      <SelectedWorkingMeal
        :workingMealData="scheduleTableData[5]"
        @workingMealSum="getComponentSum"
        ref="workingMeal"
      ></SelectedWorkingMeal>
    </div>
    <div v-show="tabIndex === 6">
      <SelectedCarSticker
        :carStickerData="scheduleTableData[6]"
        @carStickerSum="getComponentSum"
        ref="carSticker"
      ></SelectedCarSticker>
    </div>
  </div>
</template>

<script>
import SelectedOwnershipFee from './ownershipFee.vue';
import SelectedLinkageIncome from './linkageIncome.vue';
import SelectedFixedSalary from './fixedSalary.vue';
import SelectedVariableWage from './variableWage.vue';
import SelectedWelfareFee from './welfareFee.vue';
import SelectedWorkingMeal from './workingMeal.vue';
import SelectedCarSticker from './carSticker.vue';
import '@/assets/css/scheduleTable.less';
import news from '@/assets/js/notification';

export default {
  name: 'scheduleTable',
  props: ['mainFormSonData'],
  components: {
    SelectedOwnershipFee,
    SelectedLinkageIncome,
    SelectedFixedSalary,
    SelectedVariableWage,
    SelectedWelfareFee,
    SelectedWorkingMeal,
    SelectedCarSticker,
  },
  data() {
    return {
      tabIndex: 0,
      scheduleTableData: [[], [], [], [], [], [], []],
      tabList: [
        { Name: '归属费用', modelVal: 0, type: 'sumOwnershipFee' },
        { Name: '联动收入', modelVal: 0, type: 'sumLinkageIncome' },
        { Name: '固定工资', modelVal: 0, type: 'sumFixedSalary' },
        { Name: '变动工资', modelVal: 0, type: 'sumVariableWage' },
        { Name: '福利费', modelVal: 0, type: 'sumWelfareFee' },
        { Name: '工作餐补', modelVal: 0, type: 'sumWorkingMeal' },
        { Name: '车贴', modelVal: 0, type: 'sumCarSticker' },
      ],
      scheduleSubmitData: [],
      Amoeba_MonthlySSDetail: [],
      scheduleCommonData: this.$store.state.comData.commonData,
    };
  },
  methods: {
    setTabIndex(index) {
      this.tabIndex = index;
      const liElements = document.querySelectorAll('.scheduleUl>li');
      const liElLen = liElements.length;
      for (let i = 0; i < liElLen; i += 1) {
        liElements[i].classList.remove('active');
      }
      liElements[index].classList.add('active');
      this.$store.commit('setScheduleTabIndex', index);
    },
    firstLoadingRequest() {
      const OrganizationID = this.$store.state.comData.commonData.OrganizeId;
      const MonthlyPlanID = this.$store.state.comData.commonData.MPID;
      const years = news.injectYearAndMonth().Years;
      let month = news.injectYearAndMonth().Month;
      if (month < 10) {
        month = '0' + month;
      }
      const yearsAndMonth = years + month;
      const City = this.$store.state.comData.commonData.City;
      console.log({
        MonthlyPlanID,
        years: yearsAndMonth,
        OrganizationID,
        City,
      });
      this.$api.monthScheduleTable({
        MonthlyPlanID,
        years: yearsAndMonth,
        OrganizationID,
        City,
      }).then((res) => {
        console.log(JSON.parse(res.data));
        this.scheduleSubmitData = JSON.parse(res.data);
        JSON.parse(res.data).ScheduleSubject.forEach((item) => {
          this.scheduleTableData[item.Type].push(item);
        });
        this.$store.commit('setOperatingForm', JSON.parse(res.data).MonthSigningGoldYD);
        this.$store.commit('setPerformanceForm', JSON.parse(res.data).MonthPerformanceYD);
        this.$store.commit('setMissionListData', JSON.parse(res.data).Amoeba_TaskForm);
        this.$store.commit('setCompleted', true);
      }).catch((err) => {
        console.log(err);
        news.ElErrorMessage(err);
      });
    },
    getComponentSum(newVal) {
      this.tabList[newVal[0]].modelVal = Math.round(newVal[1]);
      this.tabList.forEach((item) => {
        this.$store.commit('sumScheduleForm', { type: item.type, sumVal: item.modelVal });
      });
    },
    getScheduleSubmissionData() {
      const Years = news.injectYearAndMonth().Years;
      const Month = news.injectYearAndMonth().Month;
      this.Amoeba_MonthlySSDetail = [];// 提交时重复数据bug修复；
      this.scheduleSubmitData.ScheduleSubject.forEach((item) => {
        const sObj = {};
        if (this.$store.state.comData.commonData.draft === 1) {
          sObj.ID = item.ID;
        }
        sObj.MonthlyPlanID = this.$store.state.comData.commonData.MPID;
        sObj.OrganizeId = this.$store.state.comData.commonData.OrganizeId;
        sObj.CostCode = this.$store.state.comData.commonData.Pr0139;
        sObj.Years = Years;
        sObj.Month = Month;
        sObj.City = this.$store.state.comData.commonData.City;
        sObj.ScheduleSubjectID = item.ScheduleSubjectID;
        if (item.className.indexOf('A') !== -1) {
          sObj.Amount = Number(document.querySelector('.schedulePanel .' + item.className + '>td:nth-child(4)>input').value);
        } else {
          sObj.Amount = Number(document.querySelector('.schedulePanel .' + item.className + '>td:nth-child(3)>input').value);
        }
        if (item.IsRead === 0) {
          sObj.InputValuation = Number(document.querySelector('.schedulePanel .' + item.className + '>td:nth-child(2)>input').value);
        } else {
          sObj.InputValuation = null;
        }
        this.Amoeba_MonthlySSDetail.push(sObj);
      });
      this.$store.commit('setScheduleFormData', this.Amoeba_MonthlySSDetail);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setTabIndex(0);
    });
  },
};
</script>

<style lang="less" scoped>
.schedule{
  position: relative;
  border:1px solid transparent;
  padding-top:100px;
  ul{
    position: absolute;
    top:20px;
    left:50%;
    padding-left: 0;
    margin-left: -387px;
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
<style lang="less">
  div.schedule > div > div > table >tbody>tr>td{
    input{
      text-indent: 10px;
    }
    div{
      padding-left: 10px;
    }
  }
</style>
