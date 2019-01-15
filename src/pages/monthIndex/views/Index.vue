<template>
  <div>
    <div class="table-container">
      <h2>阿米巴核算系统--月预定</h2>
      <div class="submitBtn" v-if="submitBtnShow">
        <div class="top-left" v-if="!!index">
          {{index + " " + new Date().getFullYear() + '年' + (new Date().getMonth() + 2) + '月'}}
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
          >审核通过</el-button>
          <el-button
            type="danger"
            icon="el-icon-error"
            v-if="showReviewAndReject"
          >驳回</el-button>
          <el-button type="warning">Excel导出</el-button>
        </div>
      </div>
      <el-tabs type="border-card" class="tab-container" value="schedule">
        <el-tab-pane label="主表单" name="schedule">
          <MainForm @giveStore="getStore" ref="mainForm" id="mainFormPanel" @getScheduleTableData="getSonComData"></MainForm>
        </el-tab-pane>
        <el-tab-pane label="附表">
          <ScheduleTable ref="scheduleTable" id="schedulePanel"></ScheduleTable>
        </el-tab-pane>
        <el-tab-pane label="营业收入">
          <OperatingIncome ref="operateIncome" id="operateIncomePanel"></OperatingIncome>
        </el-tab-pane>
        <el-tab-pane label="任务单">
          <MissionList id="missionListPanel"></MissionList>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueCookie from 'vue-cookie';
import { Message } from 'element-ui';
import MainForm from '../components/mainForm/mainForm.vue';
import ScheduleTable from '../components/scheduleTable/scheduleTable.vue';
import OperatingIncome from '../components/operatingIncome/operatingIncome.vue';
import MissionList from '../components/missonList/missionList.vue';
import api from '@/http/index';

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
      index: '111',
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
    };
  },
  methods: {
    getStore(val) {
      this.index = val;
    },
    getCookie() {
      this.monthUserID = VueCookie.get('monthUserID');
      this.monthCreateByUser = VueCookie.get('monthCreateByUser');
    },
    getSonComData(val) {
      this.mainFormSonData = val;
      this.$refs.scheduleTable.firstLoadingRequest();
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
      this.$refs.scheduleTable.getScheduleSubmissionData();
      this.$refs.operateIncome.getAllOperateSubmissionData();
      this.setMainAndScheduleAllSubmissionData();
    },
    setMainAndScheduleAllSubmissionData() {
      const storeCommonData = this.$store.state.comData.commonData;
      this.mainAndScheduleAllSubmissionData.Years = new Date().getFullYear();
      this.mainAndScheduleAllSubmissionData.Month = new Date().getMonth() + 2;
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
      this.mainAndScheduleAllSubmissionData.Amoeba_MonthlySSDetail = this.$store.state.scheduleForm.scheduleFormData;
      this.mainAndScheduleAllSubmissionData.MonthSigningGoldYD = this.$store.state.operatingForm.operatingFormData;
      this.mainAndScheduleAllSubmissionData.MonthPerformanceYD = this.$store.state.operatingForm.performanceFormData;
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
        if (this.monthFillStatus === '未填写' || this.monthFillStatus === '填写中' || this.monthFillStatus === '驳回') {
          this.showDraftAndSubmit = true;
        } else {
          this.showDraftAndSubmit = false;
        }
        if (this.monthFillStatus === '待审核' || this.monthFillStatus === '审核通过') {
          this.inputDisabled = true;
        } else {
          this.inputDisabled = false;
        }
      } else if (this.monthUserID !== this.monthCreateByUser) {
        this.showDraftAndSubmit = false;
        this.inputDisabled = true;
        if (this.monthFillStatus === '待审核') {
          this.showReviewAndReject = true;
        } else {
          this.showReviewAndReject = false;
        }
      } else {
        this.showReviewAndReject = false;
        if (this.monthFillStatus === '未填写' || this.monthFillStatus === '填写中' || this.monthFillStatus === '驳回') {
          this.showDraftAndSubmit = true;
        } else {
          this.showDraftAndSubmit = false;
        }
        if (this.monthFillStatus !== '待审核' && this.monthFillStatus !== '审核通过') {
          this.inputDisabled = false;
        } else {
          this.inputDisabled = true;
        }
      }
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
