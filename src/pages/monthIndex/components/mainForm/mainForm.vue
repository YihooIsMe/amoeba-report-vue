<template>
  <div class="main-form">
    <div class="main-form-btn">
      <el-button
        type="primary"
        plain
        size="small"
        @click="hideSubjectWithZero"
      >{{hideZero}}</el-button>
      <div class="red mt10">说明：白色为输入，灰色数据编辑【附表】【营业收入】后自动计算。当月实际，次月财务做账后会有数据。本表单主管审核后数据锁定。</div>
    </div>
    <div v-for="(tableData, index) in tableDataInject"
         :key="index"
         class="repeat-table-container">
      <div v-if="tableData.length>0">
        <table class="KMTable1 commonTable mainForm" border="1">
          <thead>
          <tr>
            <th><i class="el-icon-arrow-down" @click="toggleSubject($event)" id="toggle-icon">科目</i></th>
            <th>{{historicalMonth}}月实际</th>
            <!--TODO:待确定-->
            <!--TODO:新增情况下,若当前月为2月,预定为3月,1月实际出来那就是1月,1月实际不出来就是12月-->
            <th>{{scheduledMonth}}月预定</th>
            <th>{{scheduledMonth}}月实际</th>
            <th>预定比</th>
            <th>{{scheduledMonth}}月预定实际差异</th>
            <th>MP</th>
            <th>MP比</th>
            <th>累计MP</th>
            <th>累计实际</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in tableData"
              :key="i"
              :class="getForClassName(item.className)">
            <td>{{item.Name}}</td>
            <td v-for="n in 9" :key="n">
              <input type="text"
                     :readonly="isReadOnly(item, n)"
                     v-on="n === 2 && item.ReadOnly === 0 && !isReadOnly(item, n) ? { focus : ($event) => inputFocus(item.className, $event), blur : ($event) => addSep($event)} : {}"
                     @change="AutomaticCalculation(3, item.className, $event)"
                     :disabled="mainFormInputDisabled"
              >
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <transition name="fade">
      <ManagementAlert :alertIndex="alertIndex"
                       :SigningRatio="SigningRatio"
                       :applyWhere="applyWhere"
                       v-show="isAlertShow"
                       :City="City"
                       @changeAlertShow="changeShow"
                       @giveSelectedNum="getSigningRatio">
      </ManagementAlert>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import { MessageBox, Message } from 'element-ui';
import ManagementAlert from '@/components/managementAlert.vue';
import cal from '@/assets/js/comCalculation';
import news from '@/assets/js/notification';
import api from '@/http/index';

Vue.component(MessageBox.name, MessageBox);
Vue.use(api);

export default {
  name: 'mainForm',
  props: ['mainFormInputDisabled', 'mainFormTableSource', 'historicalMonth'],
  components: { ManagementAlert },
  data() {
    return {
      // userID: '{85811A95-BB15-4914-8926-82E88F5E6E78}', // 瑞虹一店;
      // userID: '{8F5FF78A-E0C0-40EE-91ED-88B32A247DE9}', // 咨询部;
      tableDataSource0: [], // Type类型为0的数据;
      tableDataSource1: [], // Type类型为1的数据;
      tableDataSource2: [], // Type类型为2的数据;
      tableDataSource3: [], // Type类型为3的数据;
      tableDataSource4: [], // Type类型为4的数据;
      tableDataSource5: [], // Type类型为5的数据;
      tableDataSource6: [], // Type类型为6的数据;
      tableDataSource7: [], // Type类型为7的数据;
      tableDataInject: [],
      rowSort: ['preMonthActual', 'currentMonthBooking', 'currentMonthActual', 'predeterminedRatio', 'scheduledActualDiff', 'MP', 'MPRatio', 'sumMP'],
      alertIndex: null,
      SigningRatio: 0.15,
      isAlertShow: false,
      applyWhere: 'monthIndex',
      Amoeba_MonthlyPlandetails: [], // 主表的数据;
      watObject: {
        sumCarSticker: 0,
        sumFixedSalary: 0,
        sumLinkageIncome: 0,
        sumOwnershipFee: 0,
        sumVariableWage: 0,
        sumWelfareFee: 0,
        sumWorkingMeal: 0,
      },
      scheduleForm: this.$store.state.scheduleForm.sumScheduleForm,
      districtScheduleSum: this.$store.state.districtSchedule.sumDistrictSchedule,
      monthFromWhichBtn: '',
      monthViewEditorYear: '',
      monthViewEditorMonth: '',
      isFixedMonth: '',
      hideZero: '隐藏整行为0的数据',
      City: '',
    };
  },
  methods: {
    toggleSubject(event) {
      cal.toggleSubject(event);
    },
    getForClassName(el) {
      return el;
    },
    changeShow() {
      this.isAlertShow = false;
    },
    getSigningRatio(val) {
      this.SigningRatio = val;
      this.isAlertShow = false;

      this.AutomaticCalculation(3, 'F1', '');
      // this.AutomaticCalculation(this.alertIndex, 'F1', '');
    },
    inputFocus(className, event) {
      const currentEl = event.target;
      if (className === 'F1' && this.$store.state.comData.commonData.Pr0111 !== 'A2') {
        this.isAlertShow = true;
        const params = {};
        params.CostCode = this.$store.state.comData.commonData.Pr0139;
        params.Years = news.injectYearAndMonth().Years;
        params.Month = news.injectYearAndMonth().Month;
        if ((params.Month + 1) % 3 === 0 || params.Month % 3 === 0) {
          this.$api.monthScheduleTable(params)
            .then((res) => {
              console.log(res);
              const data = res.data;
              cal.setQuarterData(data);
            })
            .catch((errMsg) => {
              console.log(errMsg);
            });
        }
        this.alertIndex = 3;
      } else if (currentEl.value !== '') {
        currentEl.value = cal.remSep(currentEl.value);
      }
    },
    addSep(event) {
      cal.calAddSep(event);
    },
    getBaseInfo() {
      this.isFixedMonth = news.getQueryVariable('isFixedMonth');
      this.monthFromWhichBtn = news.getQueryVariable('monthFromWhichBtn');
      if (this.monthFromWhichBtn === '1') {
        this.monthViewEditorYear = news.getQueryVariable('monthViewEditorYear');
        this.monthViewEditorMonth = news.getQueryVariable('monthViewEditorMonth');
      }
    },
    dataInjection(data, draft) {
      data.forEach((el) => {
        const elInput = document.querySelectorAll('table.commonTable tr.' + el.className + ' input');
        // F4,G2行都是百分数;
        if (el.className === 'F4' || el.className === 'G2') {
          elInput[0].value = cal.addPercent(el.Amount);
          elInput[2].value = cal.addPercent(el.TheMonthAmount);
          elInput[4].value = cal.addPercent(el.Difference);
          elInput[5].value = cal.addPercent(el.AnnualReservation);
          elInput[6].value = el.MPRatio;
          elInput[7].value = cal.addPercent(el.GrandTotalMP);
          elInput[8].value = cal.addPercent(el.GrandTotalActualMP);
        } else if (el.className === 'F5') {
          if (draft === 1) {
            this.SigningRatio = Number(el.MonthData);
          }
        } else {
          elInput[0].value = Number(el.Amount).toLocaleString();
          elInput[2].value = Number(el.TheMonthAmount).toLocaleString();
          elInput[3].value = el.PredeterminedRatio;
          elInput[4].value = Number(el.Difference).toLocaleString();
          elInput[5].value = Number(el.AnnualReservation).toLocaleString();
          elInput[6].value = el.MPRatio;
          elInput[7].value = Number(el.GrandTotalMP).toLocaleString();
          elInput[8].value = Number(el.GrandTotalActualMP).toLocaleString();
          if (draft === 1) {
            elInput[1].value = Number(el.MonthData).toLocaleString();
          }
        }
      });
      // 处于非门店的时候,数据加载完成后需要计算一遍,门店能自动计算是因为监听到数据改动
      // TODO:测试环境需要区部也计算一边,这是原始逻辑 this.$store.state.comData.commonData.identity === 'other'
      if (this.$store.state.comData.commonData.identity !== 'store') {
        cal.whereUse('monthIndex');
        cal.getCity(this.$store.state.comData.commonData.City);
        cal.judgeDepartment(this.$store.state.comData.commonData.Pr0111);
        this.currentMonthAutomaticCalculation(3);
        this.calculatePredeterminedRatio();
      }
    },
    hideSubjectWithZero() {
      if (this.hideZero === '隐藏整行为0的数据') {
        this.hideZero = '显示所有数据';
        this.mainFormTableSource.forEach((item) => {
          const allInputEl = document.querySelectorAll('table.mainForm tr.' + item.className + ' input');
          let isZero;
          for (let i = 0; i < 8; i += 1) {
            if (parseFloat(allInputEl[i].value) !== 0 && allInputEl[i].value !== '') {
              isZero = false;
              break;
            } else {
              isZero = true;
            }
          }
          if (isZero) {
            document.querySelector('table.mainForm tr.' + item.className).classList.add('hide-zero');
          }
        });
      } else {
        this.hideZero = '隐藏整行为0的数据';
        const allEl = document.querySelectorAll('table.mainForm tr');
        for (let i = 0; i < allEl.length; i += 1) {
          allEl[i].classList.remove('hide-zero');
        }
      }
    },
    mainFormFirstLoading() {
      this.injectTableSourceData();
      for (let i = 0; i < 8; i += 1) {
        this.tableDataInject.push(this['tableDataSource' + i]);
      }
      this.$nextTick(() => {
        this.dataInjection(this.mainFormTableSource, this.$store.state.comData.commonData.draft);
      });
    },
    injectTableSourceData() {
      this.mainFormTableSource.forEach((item) => {
        this.getTypeObj(this['tableDataSource' + item.Type], item);
      });
    },
    getTypeObj(tableDataSource, data) {
      const obj = {
        ReadOnly: data.ReadOnly,
        Name: data.Name,
        className: data.className,
      };
      tableDataSource.push(obj);
    },
    currentMonthAutomaticCalculation(index) {
      cal.allTableCalculation(index);
    },
    calculatePredeterminedRatio() {
      this.mainFormTableSource.forEach((el) => {
        // TODO:为什么cal.allInputEl(el)[1].value === 'NaN'会有这种情况出现； && cal.allInputEl(el)[1].value !== 'NaN'
        if (cal.allInputEl(el)[1].value !== '' && cal.allInputEl(el)[1].value !== '0' && cal.allInputEl(el)[1].value !== '0%') {
          if (el.className === 'F4' || el.className === 'G2') {
            cal.allInputEl(el)[3].value = cal.addPercent((cal.remPercent(cal.allInputEl(el)[2].value) / cal.remPercent(cal.allInputEl(el)[1].value)).toFixed(2));
          } else {
            cal.allInputEl(el)[3].value = cal.addPercent((cal.remSep(cal.allInputEl(el)[2].value) / cal.remSep(cal.allInputEl(el)[1].value)).toFixed(2));
          }
        }
      });
      this.$emit('closeLoading');
    },

    commonEvent(i, className, event) {
      let currentEl;
      if (event !== '') {
        currentEl = event.target;
      }
      cal.whereUse('monthIndex');
      cal.setMonth(news.injectYearAndMonth().Month);
      cal.getCity(this.$store.state.comData.commonData.City);
      cal.judgeDepartment(this.$store.state.comData.commonData.Pr0111);
      cal.getVueSigningRatio(this.SigningRatio);
      if (className !== 'F1' || (className === 'F1' && this.$store.state.comData.commonData.Pr0111 === 'A2')) {
        currentEl.value = Math.round(Number(currentEl.value)).toLocaleString();
      }
      this.currentMonthAutomaticCalculation(i);
      this.calculatePredeterminedRatio();
      if (event !== '') {
        currentEl.blur();
      }
    },

    AutomaticCalculation(i, className, event) {
      if (className !== 'F1') {
        if (!/^-?[0-9]+([.]{1}[0-9]+){0,1}$/.test(event.target.value)) {
          Message({
            message: '请输入有效数字!',
            duration: 1000,
            type: 'warning',
          });
          event.target.value = '';
          event.target.focus();
        } else {
          this.commonEvent(i, className, event);
        }
      } else {
        this.commonEvent(i, className, event);
      }
    },
    getAllSubmissionData() {
      const draft = this.$store.state.comData.commonData.draft;
      const Years = news.injectYearAndMonth().Years;
      const Month = news.injectYearAndMonth().Month;
      this.mainFormTableSource.forEach((item) => {
        const obj = {};
        if (draft === 1) {
          obj.ID = item.monthSSID;
        }
        obj.MonthlyPlanID = this.$store.state.comData.commonData.MPID;
        obj.OrganizeId = this.$store.state.comData.commonData.OrganizeId;
        obj.CostCode = this.$store.state.comData.commonData.Pr0139;
        obj.Years = Years;
        obj.Month = Month;
        obj.SubjectID = item.SubjectID;
        if (item.className === 'F4' || item.className === 'G2' || item.className === 'H1') {
          obj.EstimatedAmount = cal.remPercent(document.querySelector('.mainFormPanel .' + item.className + '>td:nth-child(3)>input').value);
        } else if (item.className === 'F5') {
          obj.EstimatedAmount = this.SigningRatio;
        } else {
          obj.EstimatedAmount = cal.remSep(document.querySelector('.mainFormPanel .' + item.className + '>td:nth-child(3)>input').value);
        }
        this.Amoeba_MonthlyPlandetails.push(obj);
      });
      this.$store.commit('setMainFormData', this.Amoeba_MonthlyPlandetails);
    },
    isReadOnly(item, n) {
      // 门店从附表带过来的数据,不能输入
      if (this.$store.state.comData.commonData.identity === 'store') {
        return item.ReadOnly === 1
          || n !== 2
          || item.className === 'F2'
          || item.className === 'A2'
          || item.className === 'B1'
          || item.className === 'B2'
          || item.className === 'B4'
          || item.className === 'B8'
          || item.className === 'A0'
          || item.className === 'G0'
          || item.className === 'B10';
      }
      // 区部不能输入的数据
      if (this.$store.state.comData.commonData.identity === 'district') {
        return item.ReadOnly === 1
          || n !== 2
          || item.className === 'A0'
          || item.className === 'B2'
          || item.className === 'B3'
          || item.className === 'B4'
          || item.className === 'G0';
      }
      if (this.$store.state.comData.commonData.identity === 'other') {
        return item.ReadOnly === 1
          || n !== 2;
      }
      return true;
    },
    watchCommonEvent(className, val) {
      document.querySelector('.mainForm>tbody>tr.' + className + '>td:nth-child(3)>input').value = Number(val).toLocaleString();
      cal.whereUse('monthIndex');
      cal.setMonth(news.injectYearAndMonth().Month);
      cal.getCity(this.$store.state.comData.commonData.City);
      cal.judgeDepartment(this.$store.state.comData.commonData.Pr0111);
      cal.getVueSigningRatio(this.SigningRatio);
      this.currentMonthAutomaticCalculation(3);
      this.calculatePredeterminedRatio();
    },
  },
  computed: {
    sumOwnershipFee() {
      return this.scheduleForm.sumOwnershipFee;
    },
    sumCarSticker() {
      return this.scheduleForm.sumCarSticker;
    },
    sumFixedSalary() {
      return this.scheduleForm.sumFixedSalary;
    },
    sumLinkageIncome() {
      return this.scheduleForm.sumLinkageIncome;
    },
    sumVariableWage() {
      return this.scheduleForm.sumVariableWage;
    },
    sumWelfareFee() {
      return this.scheduleForm.sumWelfareFee;
    },
    sumWorkingMeal() {
      return this.scheduleForm.sumWorkingMeal;
    },
    estimatedContractMoneySum() {
      return this.$store.state.operatingForm.operatingSum;
    },
    recoveryPerformance() {
      return this.$store.state.operatingForm.performanceSum;
    },
    sumDistrictSigningFeeAdjustment() {
      return this.districtScheduleSum.sumSigningFeeAdjustment;
    },
    sumDistrictChangeBonus() {
      return this.districtScheduleSum.sumChangeBonus;
    },
    sumDistrictWithholdingBonus() {
      return this.districtScheduleSum.sumWithholdingBonus;
    },
    sumDistrictBusinessAdjustment() {
      return this.districtScheduleSum.sumBusinessAdjustment;
    },
    sumDistrictWelfareFee() {
      return this.districtScheduleSum.sumWelfareFee;
    },
    // 预定月份
    scheduledMonth() {
      return news.injectYearAndMonth().Month;
    },
  },
  watch: {
    // 店附表数据回填;
    estimatedContractMoneySum(newVal) {
      this.$nextTick(() => {
        this.watchCommonEvent('A0', newVal);
      });
    },
    recoveryPerformance(newVal) {
      this.$nextTick(() => {
        this.watchCommonEvent('G0', newVal);
      });
    },
    sumOwnershipFee(newVal) {
      this.watchCommonEvent('F2', newVal);
    },
    sumCarSticker(newVal) {
      this.watchCommonEvent('B10', newVal);
    },
    sumFixedSalary(newVal) {
      this.watchCommonEvent('B1', newVal);
      // TODO:此时应当还要计算社会保险金和公积金
    },
    sumLinkageIncome(newVal) {
      this.watchCommonEvent('A2', newVal);
    },
    sumVariableWage(newVal) {
      this.watchCommonEvent('B2', newVal);
    },
    sumWelfareFee(newVal) {
      this.watchCommonEvent('B4', newVal);
    },
    sumWorkingMeal(newVal) {
      this.watchCommonEvent('B8', newVal);
    },
    // 区部附表数据回填到主表;
    sumDistrictSigningFeeAdjustment(val) {
      this.$nextTick(() => {
        this.watchCommonEvent('A0', -val);
      });
    },
    sumDistrictChangeBonus(val) {
      this.$nextTick(() => {
        this.watchCommonEvent('B2', val);
      });
    },
    sumDistrictBusinessAdjustment(val) {
      this.$nextTick(() => {
        this.watchCommonEvent('G0', val);
      });
    },
    sumDistrictWelfareFee(val) {
      this.$nextTick(() => {
        this.watchCommonEvent('B4', val);
      });
    },
    sumDistrictWithholdingBonus(val) {
      this.$nextTick(() => {
        this.watchCommonEvent('B3', val);
      });
    },
  },
  mounted() {
    this.getBaseInfo();
  },
};
</script>

<style lang="less" scoped>
  table.KMTable1.commonTable{
    .F5{
      display: none;
    }
    th{
      width: 10% !important;
    }
    th:nth-child(6){
      width: 11% !important;
    }
    td{
      height:43px;
      input{
        width: 100%;
        height: 100%;
        border:none;
        font-size: 16px;
        text-align: center;
      }
    }
  }
  .red{
    color:red;
  }
  .mt10{
    margin-top: 10px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
<style lang="less" scoped>
  table.KMTable1.commonTable{
    thead{
      tr{
        height: 40px;
        th:first-child{
          cursor: pointer;
          i{
            padding:5px;
          }
          i:before{
            content: '';
          }
          .el-icon-arrow-down:after{
            content: '\E603' !important;
            border:1px solid #ccc;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
          }
          i:hover{
            color:#409eff;
          }
        }
      }
    }
  }
  .toggle-subject,.hide-zero{
    display: none;
  }
  .el-icon-arrow-up:after{
    content: '\E605' !important;
    border:1px solid #ccc;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
</style>
