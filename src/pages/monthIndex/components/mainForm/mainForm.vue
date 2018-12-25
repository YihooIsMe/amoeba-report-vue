<template>
  <div class="main-form">
    <div class="main-form-btn">
      <el-button type="primary" plain size="small">隐藏所有细项</el-button>
      <div class="red mt10">说明：白色为输入，蓝色数据编辑【附表】【营业收入】后自动计算。当月实际，次月财务做账后会有数据。本表单主管审核后数据锁定。</div>
    </div>
    <div v-for="(tableData, index) in tableDataInject"
         :key="index"
         class="repeat-table-container">
      <div v-if="tableData.length>0">
        <table class="KMTable1 commonTable mainForm" border="1">
          <thead>
          <tr>
            <th>科目</th>
            <th>11月实际</th>
            <th>12月预定</th>
            <th>12月实际</th>
            <th>预定比(%)</th>
            <th>12月预定实际差异</th>
            <th>MP</th>
            <th>MP比</th>
            <th>累计MP</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in tableData"
              :key="i"
              :class="getForClassName(item.className)">
            <td>{{item.Name}}</td>
            <td v-for="n in 8" :key="n">
              <input type="text"
                     :readonly="item.ReadOnly === 1?true:false"
                     v-on="n === 2 && item.ReadOnly === 0 ? { focus : ($event) => inputFocus(item.className, $event), blur : ($event) => addSep($event)} : {}"
                     @keyup="handleInputNum"
                     @change="AutomaticCalculation(3, item.className, $event)"
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
                       @changeAlertShow="changeShow"
                       @giveSelectedNum="getSigningRatio">
      </ManagementAlert>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import ManagementAlert from '@/components/managementAlert.vue';
import cal from '@/assets/js/comCalculation';
import api from '@/http/index';

Vue.use(api);
export default {
  name: 'mainForm',
  components: { ManagementAlert },
  data() {
    return {
      userID: '{85811A95-BB15-4914-8926-82E88F5E6E78}',
      responseData: {},
      tableSource: [],
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
      SigningRatio: 0.1,
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
    };
  },
  methods: {
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
      if (className === 'F1') {
        this.isAlertShow = true;
      } else if (currentEl.value !== '') {
        currentEl.value = cal.remSep(currentEl.value);
      }
    },
    addSep(event) {
      cal.calAddSep(event);
    },
    handleInputNum(e) {
      cal.calHandleInputNum(e);
    },
    dataInjection(data, draft) {
      data.forEach((el) => {
        const elInput = document.querySelectorAll('table.commonTable tr.' + el.className + ' input');
        elInput[0].value = el.Amount;
        elInput[2].value = el.TheMonthAmount;
        elInput[3].value = el.PredeterminedRatio;
        elInput[4].value = el.Difference;
        elInput[5].value = el.AnnualReservation;
        elInput[6].value = el.MPRatio;
        elInput[7].value = el.GrandTotalMP;
        if (draft === 1) {
          elInput[1].value = el.MonthData;
        }
      });
    },
    firstLoadingRequest() {
      this.$api.yearLoadingData({
        userID: this.userID,
        IsYM: 1,
        Year: new Date().getFullYear(),
        Month: new Date().getMonth() + 1,
      }).then((res) => {
        console.log(JSON.parse(res.data));
        this.responseData = JSON.parse(res.data);
        this.$emit('giveStore', this.responseData.UnitName);
        this.tableSource = JSON.parse(res.data).list;
        this.injectTableSourceData();
        for (let i = 0; i < 8; i += 1) {
          this.tableDataInject.push(this['tableDataSource' + i]);
        }
        this.$nextTick(() => {
          this.dataInjection(this.tableSource, this.responseData.draft);
        });
        this.commitComData();
      }).catch((errMsg) => {
        console.log(errMsg);
      });
    },
    commitComData() {
      const comDataObj = {};
      comDataObj.userID = this.userID;
      comDataObj.City = this.responseData.City;
      comDataObj.Company = this.responseData.Company;
      comDataObj.DepartmentAttribute = this.responseData.DepartmentAttribute;
      comDataObj.District = this.responseData.District;
      comDataObj.F_RealName = this.responseData.F_RealName;
      comDataObj.JobAttribute = this.responseData.JobAttribute;
      comDataObj.MPID = this.responseData.MPID;
      comDataObj.OrganizeId = this.responseData.OrganizeId;
      comDataObj.MPID = this.responseData.MPID;
      comDataObj.ParentId = this.responseData.ParentId;
      comDataObj.Pr0111 = this.responseData.Pr0111;
      comDataObj.Pr0139 = this.responseData.Pr0139;
      comDataObj.SupervisorNumber = this.responseData.SupervisorNumber;
      comDataObj.UnitName = this.responseData.UnitName;
      comDataObj.draft = this.responseData.draft;
      this.$store.commit('setCommonData', comDataObj);
      this.$emit('getScheduleTableData', true);
    },
    injectTableSourceData() {
      this.tableSource.forEach((item) => {
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
      this.tableSource.forEach((el) => {
        if (cal.allInputEl(el)[1].value !== '' && cal.allInputEl(el)[1].value !== '0' && cal.allInputEl(el)[1].value !== '0.0' && cal.allInputEl(el)[1].value !== '0.00') {
          cal.allInputEl(el)[3].value = (cal.remSep(cal.allInputEl(el)[2].value) / cal.remSep(cal.allInputEl(el)[1].value)).toLocaleString();
        }
      });
    },
    AutomaticCalculation(i, className, event) {
      let currentEl;
      if (event !== '') {
        currentEl = event.target;
      }
      cal.whereUse('monthIndex');
      cal.getVueSigningRatio(this.SigningRatio);
      if (className !== 'F1') {
        currentEl.value = Number(currentEl.value).toLocaleString();
      }
      this.currentMonthAutomaticCalculation(i);
      this.calculatePredeterminedRatio();
      if (event !== '') {
        currentEl.blur();
      }
    },
    getAllSubmissionData() {
      const draft = this.responseData.draft;
      this.tableSource.forEach((item) => {
        const obj = {};
        if (draft === 1) {
          obj.ID = item.monthSSID;
        }
        obj.MonthlyPlanID = this.responseData.MPID;
        obj.OrganizeId = this.responseData.OrganizeId;
        obj.CostCode = this.responseData.Pr0139;
        obj.Years = new Date().getFullYear();
        obj.Month = new Date().getMonth() + 1;
        obj.SubjectID = item.SubjectID;
        obj.EstimatedAmount = cal.remSep(document.querySelector('#mainFormPanel .' + item.className + '>td:nth-child(3)>input').value);
        this.Amoeba_MonthlyPlandetails.push(obj);
      });
      this.$store.commit('setMainFormData', this.Amoeba_MonthlyPlandetails);
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
  },
  watch: {
    sumOwnershipFee(newVal) {
      document.querySelector('.mainForm>tbody>tr.F2>td:nth-child(3)>input').value = Number(newVal).toLocaleString();
      cal.whereUse('monthIndex');// TODO:每次进行计算需要进行是否为年度或者月度计算；因为服务管理费ABCDE等级不一样；
      this.currentMonthAutomaticCalculation(3);
      this.calculatePredeterminedRatio();// TODO:联动收入，归属费用年度计划表中并没有，月度计划新增的，确定计算逻辑的时候要特别注意；
    },
    sumCarSticker(newVal) {
      document.querySelector('.mainForm>tbody>tr.B10>td:nth-child(3)>input').value = Number(newVal).toLocaleString();
      this.calculatePredeterminedRatio();
    },
    sumFixedSalary(newVal) {
      document.querySelector('.mainForm>tbody>tr.B1>td:nth-child(3)>input').value = Number(newVal).toLocaleString();
      this.calculatePredeterminedRatio();
    },
    sumLinkageIncome(newVal) {
      document.querySelector('.mainForm>tbody>tr.A2>td:nth-child(3)>input').value = Number(newVal).toLocaleString();
      this.calculatePredeterminedRatio();
    },
    sumVariableWage(newVal) {
      document.querySelector('.mainForm>tbody>tr.B2>td:nth-child(3)>input').value = Number(newVal).toLocaleString();
      this.calculatePredeterminedRatio();
    },
    sumWelfareFee(newVal) {
      document.querySelector('.mainForm>tbody>tr.B4>td:nth-child(3)>input').value = Number(newVal).toLocaleString();
      this.calculatePredeterminedRatio();
    },
    sumWorkingMeal(newVal) {
      document.querySelector('.mainForm>tbody>tr.B8>td:nth-child(3)>input').value = Number(newVal).toLocaleString();
      this.calculatePredeterminedRatio();
    },
  },
  created() {
    this.firstLoadingRequest();
  },
};
</script>

<style lang="less" scoped>
  table.KMTable1.commonTable{
    th{
      width: 11.1%;
    }
    td{
      height:30px;
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
