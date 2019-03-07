<template>
  <div class="operating-income">
    营业收入（白色为预定，灰色为实际）
    <div class="child-operating-income">
      <el-button type="primary" plain size="small" @click="dialogTableVisible = true" v-if="showDraftAndSubmit">新增</el-button>
      <!--<el-button type="success" plain size="small" @click="modify('operate')" v-if="showDraftAndSubmit">修改</el-button>-->
      <el-button type="danger" plain size="small" @click="deleteSelected('operate')" v-if="showDraftAndSubmit">删除</el-button>
      <el-button type="warning" plain size="small" @click="matchAdjustment('operatingIncome')" v-if="reachMatchAdjustment">达成匹配调整</el-button>
      <el-table
        ref="multipleTable"
        :data="addFormArr"
        tooltip-effect="dark"
        style="width: 100%"
        stripe
        show-summary
        :summary-method="getSummaries"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange">
        <!--TODO:selectable可以控制复选框是否禁用-->
        <el-table-column
          type="selection"
          :selectable="checkSelectable"
          width="60">
        </el-table-column>
        <el-table-column
          label="序号"
          width="60">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          label="预定别"
          width="70"
          prop="bookType">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          label="经纪人" prop="brokerLabel">
        </el-table-column>
        <el-table-column
          label="种类"
          width="100">
          <template slot-scope="scope">
            <span v-html="scope.row.customerTypeSpl"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="客户姓名"
          width="125">
          <template slot-scope="scope">
            <span v-html="scope.row.customerNameSpl"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="案件名称/需求简介"
          width="120">
          <template slot-scope="scope">
            <span v-html="scope.row.objectNameDes"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="目前情况"
          prop="currentSituation">
        </el-table-column>
        <el-table-column
          label="达成可能性"
          prop="completedPercent">
        </el-table-column>
        <el-table-column
          label="全佣签约金预定"
          prop="fullCommissionSign">
        </el-table-column>
        <el-table-column
          label="全佣签约金实际"
          prop="fullCommissionSignActual">
        </el-table-column>
        <el-table-column
          label="全佣签约金预定实际差额"
          width="110"
          prop="fullCommissionSignDiff">
        </el-table-column>
        <el-table-column
          label="折让中人"
          width="100"
          prop="discountType">
        </el-table-column>
        <el-table-column
          label="折让中人金额预定"
          prop="discountAmount">
        </el-table-column>
        <el-table-column
          label="折让中人金额实际"
          prop="discountAmountActual">
        </el-table-column>
        <el-table-column
          label="折让中人预定实际差异"
          width="110"
          prop="discountAmountDiff">
        </el-table-column>
        <el-table-column
          label="预估签约金"
          width="90"
          prop="estimatedContractMoney">
        </el-table-column>
        <el-table-column
          label="实际签约金"
          width="90"
          prop="relContractMoney">
        </el-table-column>
        <el-table-column
          label="签约金预定实际差异"
          width="100"
          prop="ContractMoneyDiff">
        </el-table-column>
      </el-table>
    </div>
    <div class="performance-title">业绩收入（白色为预定，灰色为实际）</div>
    <div class="child-performance-income">
      <el-button type="primary" plain size="small" @click="dialogPerformance = true" v-if="showDraftAndSubmit">新增</el-button>
      <!--<el-button type="success" plain size="small" @click="dialogPerformance = true" v-if="showDraftAndSubmit">修改</el-button>-->
      <el-button type="danger" plain size="small" @click="deleteSelected('performance')" v-if="showDraftAndSubmit">删除</el-button>
      <el-button type="warning" plain size="small" @click="matchAdjustment('performance')" v-if="reachMatchAdjustment">达成匹配调整</el-button>
      <el-table
        ref="multipleTable"
        :data="addPerformanceArr"
        tooltip-effect="dark"
        style="width: 100%"
        stripe
        show-summary
        :summary-method="getSummaries"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChangePer">
        <el-table-column
          type="selection"
          :selectable="checkSelectable"
          width="60">
        </el-table-column>
        <el-table-column
          label="序号"
          width="60">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          label="预定别"
          width="70"
          prop="bookType">
        </el-table-column>
        <el-table-column
          prop="status"
          width="80"
          label="状态">
        </el-table-column>
        <el-table-column
          label="经纪人"
          width="80"
          prop="brokerLabel">
        </el-table-column>
        <el-table-column
          label="种类"
          width="100">
          <template slot-scope="scope">
            <span v-html="scope.row.customerTypeSpl"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="客户姓名"
          width="120">
          <template slot-scope="scope">
            <span v-html="scope.row.customerNameSpl"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="案件名称/需求简介"
          width="120">
          <template slot-scope="scope">
            <span v-html="scope.row.objectNameDes"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="目前情况"
          width="80"
          prop="currentSituation">
        </el-table-column>
        <el-table-column
          label="达成可能性"
          prop="completedPercent">
        </el-table-column>
        <el-table-column
          label="本月收回业绩(预定)"
          prop="recoveryPerformance">
        </el-table-column>
        <el-table-column
          label="本月收回业绩(实际)"
          prop="discountType">
        </el-table-column>
        <el-table-column
          label="全佣业绩预定实际差额"
          prop="discountAmount">
        </el-table-column>
      </el-table>
    </div>
    <OperatingAdd
      :dialogTableVisible="dialogTableVisible"
      :getStoreBrokerData="getStoreBrokerData"
      @changeDialogShow="getDialogShow"
      @giveFormDate="getAddFormData"></OperatingAdd>
    <AchieveAdjustment
      :achieveAdjustmentVisible="achieveAdjustmentVisible"
      ref="achieveAdjustmentEl"
      :multipleSelection="multipleSelection"
      @closeAchieveDialog="getAchieveDialog"></AchieveAdjustment>
    <PerformanceAdd
      :dialogPerformance="dialogPerformance"
      :getStoreBrokerData="getStoreBrokerData"
      @changePerformanceDialog="getPerformanceShow"
      @givePerFormDate="getPerformData"></PerformanceAdd>
    <AchievePeradjustment
      :perAchieveAdjustmentVisible="perAchieveAdjustmentVisible"
      ref="achievePerAdjustmentEl"
      :multipleSelectionPer="multipleSelectionPer"
      @closePerAchieveDialog="getPerAchieveDialog"></AchievePeradjustment>
  </div>
</template>

<script>
import Vue from 'vue';
import { Message } from 'element-ui';
import OperatingAdd from './operatingAdd.vue';
import AchieveAdjustment from './achieveAdjustment.vue';
import AchievePeradjustment from './achievePeradjustment.vue';
import PerformanceAdd from './performanceAdd.vue';
import news from '@/assets/js/notification';

export default {
  name: 'operatingIncome',
  props: ['reachMatchAdjustment'],
  components: {
    PerformanceAdd,
    AchieveAdjustment,
    OperatingAdd,
    AchievePeradjustment,
  },
  data() {
    return {
      addFormArr: [],
      addPerformanceArr: [],
      dialogTableVisible: false,
      dialogPerformance: false,
      achieveAdjustmentVisible: false,
      perAchieveAdjustmentVisible: false,
      multipleSelection: [],
      multipleSelectionPer: [],
      selectIndexArray: [],
      selectIndexArrayPer: [],
      getStoreBrokerData: [],
      MonthSigningGoldYD: [],
      MonthPerformanceYD: [],
      operatingSumIndex: 0,
      selectedIndexArr: '',
    };
  },
  methods: {
    checkSelectable(row) {
      return row.PreordainID !== '';
    },
    getROwIndex(row) {
      return this.addFormArr.lastIndexOf(row);
    },
    getROwIndexPer(row) {
      return this.addPerformanceArr.lastIndexOf(row);
    },
    // 如果想要合计的数据,另外写方法,如果写在当前方法中,会引起数据变化,变化之后会重复执行,最后会报错;
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      // TODO:data数据需要处理；
      const filterData = data.filter(item => item.PreordainID !== '');
      // TODO:后续继续修改；
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1) {
          sums[index] = '';
          return;
        }
        const values = filterData.map(item => Number(item[column.property]));
        if (!values.every(value => Number.isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return prev + curr;
            }
            return prev;
          }, 0);
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    matchAdjustment(from) {
      let info;
      if (from === 'operatingIncome') {
        if (this.multipleSelection.length === 0) {
          info = '请选择一条数据进行匹配';
          Message({
            message: info,
            type: 'error',
            duration: 2000,
          });
          return '';
        }
        if (this.multipleSelection.length > 1) {
          info = '您只能选择一条数据进行匹配';
          Message({
            message: info,
            type: 'error',
            duration: 2000,
          });
          return '';
        }
        this.achieveAdjustmentVisible = true;
        this.$refs.achieveAdjustmentEl.getTransactionCase();
      } else if (from === 'performance') {
        if (this.multipleSelectionPer.length === 0) {
          info = '请选择一条进行匹配';
          Message({
            message: info,
            type: 'error',
            duration: 2000,
          });
          return '';
        }
        if (this.multipleSelectionPer.length > 1) {
          info = '您只能选择一条进行匹配';
          Message({
            message: info,
            type: 'error',
            duration: 2000,
          });
          return '';
        }
        this.perAchieveAdjustmentVisible = true;
        this.$refs.achievePerAdjustmentEl.getPerTransactionCase();
      }
      return '';
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // this.selectIndexArray = [];
      // console.log(val);
      // const self = this;
      // val.map((el) => {
      //   const selectRowIndex = self.getROwIndex(el);
      //   if (selectRowIndex !== -1) {
      //     self.selectIndexArray.push(selectRowIndex);
      //   }
      //   return '';
      // });
      // this.selectIndexArray = this.selectIndexArray.sort(this.sortNumber);
    },
    handleSelectionChangePer(val) {
      this.multipleSelectionPer = val;
      // this.selectIndexArrayPer = [];
      // console.log(val);
      // this.multipleSelectionPer = val;
      // const self = this;
      // val.map((el) => {
      //   const selectRowIndexPer = self.getROwIndexPer(el);
      //   if (selectRowIndexPer !== -1) {
      //     self.selectIndexArrayPer.push(selectRowIndexPer);
      //   }
      //   return '';
      // });
      // this.selectIndexArrayPer = this.selectIndexArrayPer.sort(this.sortNumber);
    },
    sortNumber(a, b) {
      return a - b;
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    // TODO:后续功能添加;
    // modify(change) {
    //   if (change === 'operate') {
    //     if (this.multipleSelection.length === 1) {
    //       console.log(this.addFormArr[this.multipleSelection[0].index]);
    //       const selectedForm = this.addFormArr[this.multipleSelection[0].index];
    //       const formData = {};
    //       formData.broker = selectedForm.broker;
    //       formData.saleAndLease = selectedForm.saleAndLease;
    //       formData.customerType = selectedForm.customerType;
    //       if (selectedForm.customerType === 1) {
    //         formData.objectNum = selectedForm.objectNum;
    //         formData.caseName = selectedForm.caseName;
    //         formData.customer = selectedForm.customer;
    //       }
    //       if (selectedForm.customerType === 2) {
    //         // formData.searchCustomer =
    //       }
    //     } else {
    //       Message({
    //         message: '您仅能选择一条信息进行修改!',
    //         type: 'error',
    //         duration: 2000,
    //       });
    //     }
    //   }
    //   if (change === 'performance') {
    //
    //   }
    // },
    deleteSelected(sel) {
      if (sel === 'operate') {
        if (this.multipleSelection.length === this.addFormArr.length) {
          this.addFormArr = [];
        } else {
          // const copyAddFormArr = this.addFormArr.concat();
          // // 特别注意此处的逻辑,删除array的数据后要自动往前挪一步;
          // for (let i = 0; i < this.selectIndexArray.length; i += 1) {
          //   if (i === 0) {
          //     copyAddFormArr.splice(this.selectIndexArray[i], 1);
          //   } else {
          //     copyAddFormArr.splice(this.selectIndexArray[i] - 1, 1);
          //   }
          // }
          // console.log(copyAddFormArr);
          // this.addFormArr = copyAddFormArr;
          const arr = [];
          this.multipleSelection.forEach((item) => {
            arr.push(item.index);
          });
          this.selectIndexArray = arr.sort(this.sortNumber);
          for (let i = this.selectIndexArray.length - 1; i >= 0; i -= 1) {
            this.addFormArr.splice(this.selectIndexArray[i], 1);
          }
        }
      } else if (sel === 'performance') {
        if (this.multipleSelectionPer.length === this.addPerformanceArr.length) {
          this.addPerformanceArr = [];
        } else {
          // const copyAddPerformanceArr = this.addPerformanceArr.concat();
          // for (let i = 0; i < this.selectIndexArrayPer.length; i += 1) {
          //   if (i === 0) {
          //     copyAddPerformanceArr.splice(this.selectIndexArrayPer[i], 1);
          //   } else {
          //     copyAddPerformanceArr.splice(this.selectIndexArrayPer[i] - 1, 1);
          //   }
          // }
          // console.log(copyAddPerformanceArr);
          // this.addPerformanceArr = copyAddPerformanceArr;
          const arr = [];
          this.multipleSelectionPer.forEach((item) => {
            arr.push(item.index);
          });
          this.selectIndexArrayPer = arr.sort(this.sortNumber);
          console.log(this.selectIndexArrayPer);
          for (let i = this.selectIndexArrayPer.length - 1; i >= 0; i -= 1) {
            this.addPerformanceArr.splice(this.selectIndexArrayPer[i], 1);
          }
        }
      }
    },
    getDialogShow(newVal) {
      this.dialogTableVisible = newVal;
    },
    getPerformanceShow(newVal) {
      this.dialogPerformance = newVal;
    },
    getAchieveDialog(newVal) {
      this.achieveAdjustmentVisible = newVal;
    },
    getPerAchieveDialog(newVal) {
      this.perAchieveAdjustmentVisible = newVal;
    },
    getPerformData(newVal) {
      const formArrObj = {};
      if (newVal.customerType === 1) {
        formArrObj.customerNameSpl = newVal.customer.split(' ')[0] + '<br>' + newVal.customer.split(' ')[1];
        formArrObj.customerName = newVal.customer.split(' ')[0];
        formArrObj.customerPhone = newVal.customer.split(' ')[1];
        formArrObj.objectNameDes = newVal.objectNum + '<br>' + newVal.caseName;
        formArrObj.objectNum = newVal.objectNum;
        formArrObj.caseName = newVal.caseName;
      } else {
        formArrObj.customerNameSpl = newVal.searchCustomerName + '<br>' + newVal.searchCustomer;
        formArrObj.customerName = newVal.searchCustomerName;
        formArrObj.customerPhone = newVal.searchCustomer;
        formArrObj.objectNameDes = newVal.demandContent;
        formArrObj.objectNum = '';
        formArrObj.caseName = newVal.demandContent;
      }
      formArrObj.bookType = '月预订';
      formArrObj.status = '未达成'; // TODO:后面数据库传入数据;
      formArrObj.broker = newVal.broker;
      formArrObj.searchCustomer = newVal.searchCustomer;
      formArrObj.searchCustomerName = newVal.searchCustomerName;
      formArrObj.demandContent = newVal.demandContent;
      formArrObj.brokerLabel = newVal.brokerLabel;
      formArrObj.saleAndLease = newVal.saleAndLease;
      formArrObj.customerType = newVal.customerType;
      formArrObj.customerID = newVal.customerID;
      formArrObj.customerTypeSpl = (newVal.saleAndLease === 1 ? '买卖' : '租赁') + '(' + (newVal.customerType === 1 ? '业主方' : '买方') + ')';
      formArrObj.currentSituation = newVal.currentSituation;
      formArrObj.completedPercent = newVal.completedPercent + '%'; // TODO:暂时先写死;
      formArrObj.recoveryPerformance = newVal.recoveryPerformance;
      // Vue.set(formArrObj, 'discountType', 12345);
      this.addPerformanceArr.push(formArrObj);
    },
    getAddFormData(newVal) {
      const formArrObj = {};
      if (newVal.customerType === 1) {
        formArrObj.customerNameSpl = newVal.customer.split(' ')[0] + '<br>' + newVal.customer.split(' ')[1];
        formArrObj.customerName = newVal.customer.split(' ')[0];
        formArrObj.customerPhone = newVal.customer.split(' ')[1];
        formArrObj.objectNameDes = newVal.objectNum + '<br>' + newVal.caseName;
        formArrObj.objectNum = newVal.objectNum;
        formArrObj.caseName = newVal.caseName;
      } else {
        formArrObj.customerNameSpl = newVal.searchCustomerName + '<br>' + newVal.searchCustomer;
        formArrObj.customerName = newVal.searchCustomerName;
        formArrObj.customerPhone = newVal.searchCustomer;
        formArrObj.objectNameDes = newVal.demandContent;
        formArrObj.objectNum = '';
        formArrObj.caseName = newVal.demandContent;
      }
      formArrObj.bookType = '月预订';
      formArrObj.status = '未达成'; // TODO:后面数据库传入数据;
      formArrObj.broker = newVal.broker;
      formArrObj.searchCustomer = newVal.searchCustomer;
      formArrObj.searchCustomerName = newVal.searchCustomerName;
      formArrObj.demandContent = newVal.demandContent;
      formArrObj.brokerLabel = newVal.brokerLabel;
      formArrObj.saleAndLease = newVal.saleAndLease;
      formArrObj.customerType = newVal.customerType;
      formArrObj.customerID = newVal.customerID;
      formArrObj.customerTypeSpl = (newVal.saleAndLease === 1 ? '买卖' : '租赁') + '(' + (newVal.customerType === 1 ? '业主方' : '买方') + ')';

      formArrObj.currentSituation = newVal.currentSituation;
      formArrObj.completedPercent = newVal.completedPercent + '%'; // TODO:暂时先写死;
      formArrObj.fullCommissionSign = newVal.fullCommissionSign;
      formArrObj.discountType = newVal.discountType;
      formArrObj.discountAmount = newVal.discountAmount;
      formArrObj.estimatedContractMoney = newVal.fullCommissionSign - newVal.discountAmount;
      console.log(formArrObj);
      // 预定的时候,没有实际的数据
      // Vue.set(formArrObj, 'fullCommissionSignActual', 12345);
      // Vue.set(formArrObj, 'discountAmountActual', 12345);
      // Vue.set(formArrObj, 'relContractMoney', 12345);
      this.addFormArr.push(formArrObj);
    },
    getStoreBroker() {
      console.log({ OrganizeID: this.$store.state.comData.commonData.OrganizeId });
      this.$api.queryAndAddedUserInfo({ OrganizeID: this.$store.state.comData.commonData.OrganizeId })
        .then((res) => {
          this.getStoreBrokerData = JSON.parse(res.data);
          console.log(JSON.parse(res.data));
        })
        .catch((err) => {
          console.log(err);
          news.ElErrorMessage(err);
        });
    },
    getAllOperateSubmissionData() {
      this.getOperateSubmissionData();
      this.getPerformanceSubmissionData();
    },
    getOperateSubmissionData() {
      this.MonthSigningGoldYD = [];
      this.addFormArr.forEach((el) => {
        const addFormObj = {};
        if (el.customerType === 1) {
          addFormObj.CaseName = el.objectNum;
          addFormObj.ObjectName = el.caseName;
          addFormObj.CustomerName = el.customerName;
          addFormObj.CustomerPhone = el.customerPhone;
        } else {
          addFormObj.CustomerName = el.searchCustomerName;
          addFormObj.CustomerPhone = el.searchCustomer;
          addFormObj.CaseName = el.demandContent;
          addFormObj.ObjectName = '';
        }
        addFormObj.PreordainID = this.$store.state.comData.commonData.MPID;
        addFormObj.Status = el.status;
        addFormObj.PersonnelID = el.broker;
        addFormObj.PersonnelName = el.brokerLabel;
        addFormObj.CaseType = el.saleAndLease;
        addFormObj.CustomerType = el.customerType;
        addFormObj.CustomerID = el.customerID;
        addFormObj.CurrentSituation = el.currentSituation;
        addFormObj.AchievePossibility = el.completedPercent;
        addFormObj.SigningGoldYD = el.estimatedContractMoney;
        addFormObj.SigningGoldSJ = el.relContractMoney;
        addFormObj.DiscountType = el.discountType;
        addFormObj.DiscountGoldYD = el.discountAmount;
        addFormObj.DiscountGoldSJ = el.discountAmountActual;
        addFormObj.FullCommissionYD = el.fullCommissionSign;
        addFormObj.FullCommissionSJ = el.fullCommissionSignActual;
        addFormObj.OrganizationID = this.$store.state.comData.commonData.OrganizationID;
        this.MonthSigningGoldYD.push(addFormObj);
      });
      this.$store.commit('setOperatingForm', this.MonthSigningGoldYD);
    },
    getPerformanceSubmissionData() {
      this.MonthPerformanceYD = [];
      this.addPerformanceArr.forEach((el) => {
        const addPerFormData = {};
        if (el.customerType === 1) {
          addPerFormData.CaseName = el.objectNum;
          addPerFormData.ObjectName = el.caseName;
          addPerFormData.CustomerName = el.customerName;
          addPerFormData.CustomerPhone = el.customerPhone;
        } else {
          addPerFormData.CustomerName = el.searchCustomerName;
          addPerFormData.CustomerPhone = el.searchCustomer;
          addPerFormData.CaseName = el.demandContent;
          addPerFormData.ObjectName = '';
        }
        addPerFormData.PreordainID = this.$store.state.comData.commonData.MPID;
        addPerFormData.CustomerID = el.customerID;
        addPerFormData.Status = el.status;
        addPerFormData.CaseType = el.saleAndLease;
        addPerFormData.CustomerType = el.customerType;
        addPerFormData.CurrentSituation = el.currentSituation;
        addPerFormData.AchievePossibility = el.completedPercent;
        addPerFormData.PersonnelID = el.broker;
        addPerFormData.PersonnelName = el.brokerLabel;
        addPerFormData.PerformanceYD = el.recoveryPerformance;
        addPerFormData.PerformanceSJ = el.discountType;
        addPerFormData.OrganizationID = this.$store.state.comData.commonData.OrganizationID;
        this.MonthPerformanceYD.push(addPerFormData);
      });
      this.$store.commit('setPerformanceForm', this.MonthPerformanceYD);
    },
    operateFirstRequest() {
      // console.log(this.$store.state.operatingForm.operatingFormData);
      // console.log(this.$store.state.operatingForm.performanceFormData);
      // this.MonthSigningGoldYD = this.$store.state.operatingForm.operatingFormData;
      // this.MonthPerformanceYD = this.$store.state.operatingForm.performanceFormData;
      this.firstInjectAddFormArr();
      this.firstInjectAddPerformanceArr();
    },
    firstInjectAddFormArr() {
      this.$store.state.operatingForm.operatingFormData.forEach((el) => {
        const addFormObj = {};
        if (el.CustomerType === 1) {
          addFormObj.objectNum = el.CaseName;
          addFormObj.caseName = el.ObjectName;
          addFormObj.customerName = el.CustomerName;
          addFormObj.customerPhone = el.CustomerPhone;

          addFormObj.searchCustomerName = '';
          addFormObj.searchCustomer = '';
          addFormObj.demandContent = '';
        } else {
          addFormObj.objectNum = '';// TODO:这里到时候应当改为el.ObjectName;
          addFormObj.caseName = '';
          addFormObj.customerName = '';
          addFormObj.customerPhone = '';

          addFormObj.searchCustomerName = el.CustomerName;
          addFormObj.searchCustomer = el.CustomerPhone;
          addFormObj.demandContent = el.CaseName;
        }
        addFormObj.customerNameSpl = el.CustomerName + '<br>' + el.CustomerPhone;
        // addFormObj.customerName = el.CustomerName;
        // addFormObj.customerPhone = el.CustomerPhone;
        addFormObj.objectNameDes = el.CaseName + '<br>' + el.ObjectName;
        // addFormObj.objectNum = el.CaseName;
        // addFormObj.caseName = el.ObjectName;

        addFormObj.status = el.Status === 0 ? '未达成' : '达成'; // TODO:后面数据库传入数据;
        addFormObj.broker = el.PersonnelID;
        addFormObj.brokerLabel = el.PersonnelName;
        addFormObj.saleAndLease = el.CaseType;
        addFormObj.customerType = el.CustomerType;
        addFormObj.customerID = el.CustomerID;
        addFormObj.customerTypeSpl = (el.CaseType === 1 ? '买卖' : '租赁') + '(' + (el.CustomerType === 1 ? '业主方' : '买方') + ')';
        addFormObj.currentSituation = el.CurrentSituation;
        addFormObj.completedPercent = el.AchievePossibility; // TODO:暂时先写死;
        addFormObj.fullCommissionSign = el.FullCommissionYD;
        addFormObj.discountType = el.DiscountType;
        addFormObj.discountAmount = el.DiscountGoldYD;
        addFormObj.discountRelAmount = el.DiscountGoldSJ; // TODO:暂时先写死;
        addFormObj.estimatedContractMoney = el.SigningGoldYD;
        addFormObj.fullCommissionSignDiff = el.FullCommissionDifference;
        addFormObj.ContractMoneyDiff = el.SigningGoldDifference;
        addFormObj.discountAmountDiff = el.DiscountGoldDifference;
        addFormObj.ID = el.ID;
        addFormObj.PreordainID = el.PreordainID;
        if (el.PreordainID === '') {
          addFormObj.bookType = '';
        } else {
          addFormObj.bookType = '月预订';
        }
        Vue.set(addFormObj, 'fullCommissionSignActual', el.FullCommissionSJ);
        Vue.set(addFormObj, 'discountAmountActual', el.DiscountGoldSJ);
        Vue.set(addFormObj, 'relContractMoney', el.SigningGoldSJ);
        this.addFormArr.push(addFormObj);
      });
    },
    firstInjectAddPerformanceArr() {
      this.$store.state.operatingForm.performanceFormData.forEach((el) => {
        const addPerFormObj = {};
        if (el.CustomerType === 1) {
          addPerFormObj.objectNum = el.CaseName;
          addPerFormObj.caseName = el.ObjectName;
          addPerFormObj.customerName = el.CustomerName;
          addPerFormObj.customerPhone = el.customerPhone;

          addPerFormObj.searchCustomerName = '';
          addPerFormObj.searchCustomer = '';
          addPerFormObj.demandContent = '';
        } else {
          addPerFormObj.searchCustomerName = el.CustomerName;
          addPerFormObj.searchCustomer = el.CustomerPhone;
          addPerFormObj.demandContent = el.CaseName;

          addPerFormObj.objectNum = '';
          addPerFormObj.caseName = '';
          addPerFormObj.customerName = '';
          addPerFormObj.customerPhone = '';
        }


        addPerFormObj.status = el.Status === 0 ? '未达成' : '达成';
        // addPerFormObj.status = '达成'; // TODO:后面数据库传入数据;
        addPerFormObj.broker = el.PersonnelID;
        addPerFormObj.brokerLabel = el.PersonnelName;
        addPerFormObj.saleAndLease = el.CaseType;
        addPerFormObj.customerType = el.CustomerType;
        addPerFormObj.customerID = el.CustomerID;
        addPerFormObj.customerTypeSpl = (el.CaseType === 1 ? '买卖' : '租赁') + '(' + (el.CustomerType === 1 ? '业主方' : '买方') + ')';
        addPerFormObj.customerNameSpl = el.CustomerName + '<br>' + el.CustomerPhone;
        // addPerFormObj.customerName = el.CustomerName;
        // addPerFormObj.customerPhone = el.CustomerPhone;
        addPerFormObj.objectNameDes = el.CaseName + '<br>' + el.ObjectName;
        // addPerFormObj.objectNum = el.CaseName;
        // addPerFormObj.caseName = el.ObjectName;
        addPerFormObj.currentSituation = el.CurrentSituation;
        addPerFormObj.completedPercent = el.AchievePossibility; // TODO:暂时先写死;
        addPerFormObj.recoveryPerformance = el.PerformanceYD;
        addPerFormObj.discountAmount = el.PerformanceDifference;
        addPerFormObj.PreordainID = el.PreordainID;
        if (el.PreordainID === '') {
          addPerFormObj.bookType = '';
        } else {
          addPerFormObj.bookType = '月预订';
        }
        Vue.set(addPerFormObj, 'discountType', el.PerformanceSJ);
        this.addPerformanceArr.push(addPerFormObj);
      });
    },
    getIncomeSum(newArr, i) {
      let sum = 0;
      if (i === 'operatingIncome') {
        newArr.forEach((el) => {
          sum = Number(el.estimatedContractMoney) + sum;
        });
        this.$store.commit('setOperatingSum', sum);
      } else if (i === 'performance') {
        newArr.forEach((el) => {
          sum = Number(el.recoveryPerformance) + sum;
        });
        this.$store.commit('setPerformanceSum', sum);
      }
    },
  },
  computed: {
    isCompleted() {
      return this.$store.state.scheduleForm.isCompleted;
    },
    showDraftAndSubmit() {
      return this.$store.state.comData.showDraftAndSubmit;
    },
  },
  watch: {
    isCompleted() {
      this.operateFirstRequest();
    },
    addFormArr(newVal) {
      this.getIncomeSum(newVal, 'operatingIncome');
    },
    addPerformanceArr(newVal) {
      this.getIncomeSum(newVal, 'performance');
    },
  },
  mounted() {
    // TODO:查询经纪人为什么不能放在computed,并watch呢???
    this.getStoreBroker();
  },
};
</script>

<style scoped>

.operating-income {
  padding: 5px;
}
.performance-title{
  margin-top: 20px;
}
.child-operating-income,.child-performance-income{
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
</style>
<style>
  div.operating-income.operateIncomePanel .achieve-dialog .achieve-dialog-content .radio .el-radio{
    margin-top: 10px;
    margin-left: 10px;
  }
</style>
