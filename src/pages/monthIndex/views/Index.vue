<template>
  <div>
    <div class="table-container">
      <h2>阿米巴核算系统--月预定</h2>
      <div class="submitBtn" v-if="submitBtnShow">
        <div class="top-left" v-if="!!index">
          {{storeYearMonth}}
        </div>
        <div class="top-right">
          <el-button
            type="primary"
            plain
            @click="dataSubmission(0)"
            v-if="showDraftAndSubmit"
          >保存草稿</el-button>
          <el-button
            type="success"
            plain
            @click="dataSubmission(1)"
            v-if="showDraftAndSubmit"
          >数据提交</el-button>
          <el-button
            type="success"
            icon="el-icon-success"
            v-if="showReviewAndReject"
            @click="reviewAndReject(2)"
          >审核通过</el-button>
          <el-button
            type="danger"
            icon="el-icon-error"
            v-if="showReviewAndReject"
            @click="reviewAndReject(3)"
          >驳回</el-button>
          <el-button type="warning" v-if="$store.state.comData.commonData.draft === 1">Excel导出</el-button>
          <el-button type="warning" plain @click="clearData" v-if="true">清空数据</el-button>
        </div>
      </div>
      <el-tabs type="border-card" class="tab-container" :value="selectTabPane" @tab-click="tabClick">
        <template v-if="!isBehind">
          <el-tab-pane label="主表单" name="mainForm">
            <MainForm
              @giveStore="getStore"
              ref="mainForm"
              class="mainFormPanel"
              :mainFormInputDisabled="inputDisabled"
              @getScheduleTableData="getSonComData"></MainForm>
          </el-tab-pane>
          <el-tab-pane label="附表" name="schedule">
            <ScheduleTable ref="scheduleTable" class="schedulePanel"></ScheduleTable>
          </el-tab-pane>
          <el-tab-pane label="营业收入" name="operateIncome">
            <OperatingIncome ref="operateIncome" class="operateIncomePanel"></OperatingIncome>
          </el-tab-pane>
          <el-tab-pane label="任务单" name="missionList">
            <MissionList class="missionListPanel"></MissionList>
          </el-tab-pane>
        </template>
        <template v-else>
          <el-tab-pane label="主表单" name="mainForm">
            <MainForm
              :mainFormInputDisabled="inputDisabled"
              @giveStore="getStore"
              class="mainFormPanel"
              ref="mainForm"
              @getScheduleTableData="getSonComData"></MainForm>
          </el-tab-pane>
          <el-tab-pane label="任务单" name="missionList">
            <MissionList  class="missionListPanel"></MissionList>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueCookie from 'vue-cookie';
import { MessageBox, Message } from 'element-ui';
import MainForm from '../components/mainForm/mainForm.vue';
import ScheduleTable from '../components/scheduleTable/scheduleTable.vue';
import OperatingIncome from '../components/operatingIncome/operatingIncome.vue';
import MissionList from '../components/missonList/missionList.vue';
import api from '@/http/index';

Vue.component(MessageBox.name, MessageBox);
Vue.use(api);
Vue.use(VueCookie);

export default {
  name: 'Container',
  components: {
    MainForm, ScheduleTable, OperatingIncome, MissionList,
  },
  data() {
    return {
      submitBtnShow: true,
      index: '',
      review: 0,
      mainAndScheduleAllSubmissionData: {},
      mainFormSonData: false,
      loadingCover: '',
      monthFillStatus: '',
      monthUserID: '',
      monthCreateByUser: '',
      showReviewAndReject: false,
      showDraftAndSubmit: false,
      inputDisabled: false,
      isBehind: true, // 判断是否为幕僚,幕僚没有附表和营业收入
      selectTabPane: this.$store.state.comData.selectTabPane || 'mainForm',
    };
  },
  methods: {
    clearData() {
      this.$api.yearClearAllData({ i: 1 })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    tabClick(el) {
      this.$store.commit('setSelectTabPane', el.name);
    },
    getStore(val) {
      this.index = val;
    },
    getCookie() {
      this.monthUserID = VueCookie.get('monthUserID');
      this.monthCreateByUser = VueCookie.get('monthCreateByUser');
    },
    getSonComData(val) {
      this.mainFormSonData = val;
    },
    dataSubmission(index) {
      this.loadingCover = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      this.review = index;
      this.$refs.mainForm.getAllSubmissionData();
      if (!this.isBehind) {
        this.$refs.scheduleTable.getScheduleSubmissionData();
        this.$refs.operateIncome.getAllOperateSubmissionData();
      }
      this.setMainAndScheduleAllSubmissionData();
    },
    getQueryAddYear() {
      if (VueCookie.get('monthFromWhichBtn') === 'viewEditorBtn') {
        return VueCookie.get('monthViewEditorYear');
      }
      if (VueCookie.get('monthFromWhichBtn') === 'newAdded') {
        if (new Date().getMonth() + 2 === 13) {
          return new Date().getFullYear() + 1;
        }
        return new Date().getFullYear();
      }
      return '';
    },
    getQueryAddMonth() {
      if (VueCookie.get('monthFromWhichBtn') === 'viewEditorBtn') {
        return VueCookie.get('monthViewEditorMonth');
      }
      if (VueCookie.get('monthFromWhichBtn') === 'newAdded') {
        if (new Date().getMonth() + 2 === 13) {
          return 1;
        }
        return new Date().getMonth() + 2;
      }
      return '';
    },
    setMainAndScheduleAllSubmissionData() {
      this.mainAndScheduleAllSubmissionData = {};
      const storeCommonData = this.$store.state.comData.commonData;
      // this.mainAndScheduleAllSubmissionData.Years = new Date().getFullYear();
      this.mainAndScheduleAllSubmissionData.Years = this.getQueryAddYear();
      // this.mainAndScheduleAllSubmissionData.Month = new Date().getMonth() + 2;
      // this.mainAndScheduleAllSubmissionData.Month = 5;
      // TODO:这里代码需要改回来;
      // this.mainAndScheduleAllSubmissionData.Month = this.getQueryAddMonth();
      // TODO:上一行的代码改回来;
      this.mainAndScheduleAllSubmissionData.Month = 1;
      this.mainAndScheduleAllSubmissionData.MonthlyPlanID = storeCommonData.MPID;
      this.mainAndScheduleAllSubmissionData.CostCode = storeCommonData.Pr0139;
      this.mainAndScheduleAllSubmissionData.OrganizeId = storeCommonData.OrganizeId;
      this.mainAndScheduleAllSubmissionData.ParentId = storeCommonData.ParentId;
      this.mainAndScheduleAllSubmissionData.Company = storeCommonData.Company;
      this.mainAndScheduleAllSubmissionData.District = storeCommonData.District;
      this.mainAndScheduleAllSubmissionData.department = storeCommonData.DepartmentAttribute;
      this.mainAndScheduleAllSubmissionData.City = storeCommonData.City;
      this.mainAndScheduleAllSubmissionData.Review = this.review;// 保存草稿为0；数据提交为1；
      this.mainAndScheduleAllSubmissionData.CreateByUser = storeCommonData.userID;
      this.mainAndScheduleAllSubmissionData.F_RealName = storeCommonData.F_RealName;
      this.mainAndScheduleAllSubmissionData.OrganizeName = storeCommonData.UnitName;
      this.mainAndScheduleAllSubmissionData.Pr0111 = storeCommonData.Pr0111;
      this.mainAndScheduleAllSubmissionData.Amoeba_MonthlyPlandetails = this.$store.state.mainForm.mainFormData;
      if (this.isBehind) {
        this.mainAndScheduleAllSubmissionData.MonthSigningGoldYD = [];
        this.mainAndScheduleAllSubmissionData.MonthPerformanceYD = [];
        this.mainAndScheduleAllSubmissionData.Amoeba_MonthlySSDetail = [];
      } else {
        this.mainAndScheduleAllSubmissionData.MonthSigningGoldYD = this.$store.state.operatingForm.operatingFormData;
        this.mainAndScheduleAllSubmissionData.MonthPerformanceYD = this.$store.state.operatingForm.performanceFormData;
        this.mainAndScheduleAllSubmissionData.Amoeba_MonthlySSDetail = this.$store.state.scheduleForm.scheduleFormData;
      }
      console.log(this.mainAndScheduleAllSubmissionData);
      this.$api.monthMainAndScheduleSub(this.mainAndScheduleAllSubmissionData)
        .then((res) => {
          console.log(res);
          this.loadingCover.close();
          let type;
          if (res.data.isSuccess === false) {
            type = 'error';
          } else {
            type = 'success';
          }
          Message({
            message: res.data.errorMessage,
            type,
          });
          if (type === 'success') {
            VueCookie.set('monthFillStatus', '待审核');
            window.location.reload();
            /* TODO:正式环境的时候reload需要，但是现在不需要 */
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMonthFillStatus() {
      this.monthFillStatus = VueCookie.get('monthFillStatus');
    },
    monthJudgeInputDisabled() {
      if (VueCookie.get('monthFromWhichBtn') === 'newAdded') {
        this.showReviewAndReject = false;
        this.showDraftAndSubmit = this.monthFillStatus === '未填写' || this.monthFillStatus === '填写中' || this.monthFillStatus === '驳回';
        this.inputDisabled = this.monthFillStatus === '待审核' || this.monthFillStatus === '审核通过';
      } else if (this.monthUserID !== this.monthCreateByUser) {
        this.showDraftAndSubmit = false;
        this.inputDisabled = true;
        this.showReviewAndReject = this.monthFillStatus === '待审核';
      } else {
        this.showReviewAndReject = false;
        this.showDraftAndSubmit = this.monthFillStatus === '未填写' || this.monthFillStatus === '填写中' || this.monthFillStatus === '驳回';
        this.inputDisabled = !(this.monthFillStatus !== '待审核' && this.monthFillStatus !== '审核通过');
      }
      this.$store.commit('setInputDisabled', this.inputDisabled);
      this.$store.commit('setShowDraftAndSubmit', this.showDraftAndSubmit);
    },
    reviewAndReject(index) {
      this.$api.queryAndAddedQuery({
        MPID: this.$store.state.comData.commonData.MPID,
        status: index,
        User: VueCookie.get('monthUserID'),
        IsYM: 1,
      }).then(() => {
        let content;
        if (index === 2) {
          content = '您已经审核通过!';
        } else {
          content = '您已经驳回了！';
        }
        MessageBox.alert(content, '提示', {
          confirmButtonText: '确定',
          callback(action) {
            console.log(action);
          },
        });
      }).catch((errMsg) => {
        console.log(errMsg);
      });
    },
  },
  watch: {
    mainFormSonData() {
      this.isBehind = this.$store.state.comData.commonData.JobAttribute === '04';
      // console.log(this.$refs.scheduleTable);
      // this.$refs.scheduleTable.firstLoadingRequest();
      this.$nextTick(() => {
        if (!this.isBehind) {
          this.$refs.scheduleTable.firstLoadingRequest();
        }
      });
    },
  },
  computed: {
    storeYearMonth() {
      if (VueCookie.get('monthFromWhichBtn') === 'viewEditorBtn') {
        return this.index + ' ' + VueCookie.get('monthViewEditorYear') + '年' + VueCookie.get('monthViewEditorMonth') + '月';
      }
      // TODO:正是环境改回来;
      // return this.index + ' ' + new Date().getFullYear() + '年' + (new Date().getMonth() + 2) + '月';
      return this.index + ' ' + new Date().getFullYear() + '年01月';
    },
  },
  mounted() {
    this.getStore();
    this.getMonthFillStatus();
    this.monthJudgeInputDisabled();
  },
  created() {
    this.getCookie();
  },
  beforeDestroy() {

  },
};
</script>

<style lang="less">
  .table-container{
    h2{
      text-align: center;
    }
  }
  .tab-container{
    margin-top: 20px;
  }
  .submitBtn{
    position: relative;
    height:40px;
    line-height: 40px;
    margin-top: 20px;
    .top-left{
      position:absolute;
      top:0;
      left:0;
      font-size:20px;
      font-weight: bold;
    }
    .top-right{
      position: absolute;
      top:0;
      right:0;
    }
  }
  table.KMTable1.commonTable{
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    text-align: center;
    th{
      width: 11% !important;
    }
  }
</style>
