<template>
  <div>
    <div class="table-container">
      <h2>阿米巴核算系统--月预定</h2>
      <div class="submitBtn" v-if="submitBtnShow">
        <div class="top-left" v-if="!!UnitName">
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
        <template v-if="identity === 'store'">
          <el-tab-pane label="主表单" name="mainForm">
            <MainForm
              ref="mainForm"
              @closeLoading="closeLoading"
              :mainFormTableSource="mainFormTableSource"
              class="mainFormPanel"
              :mainFormInputDisabled="inputDisabled"></MainForm>
          </el-tab-pane>
          <el-tab-pane label="附表" name="schedule">
            <ScheduleTable ref="scheduleTable" class="schedulePanel"></ScheduleTable>
          </el-tab-pane>
          <el-tab-pane label="营业收入" name="operateIncome">
            <OperatingIncome
              ref="operateIncome"
              class="operateIncomePanel"
              :reachMatchAdjustment="reachMatchAdjustment"
            ></OperatingIncome>
          </el-tab-pane>
          <el-tab-pane label="任务单" name="missionList">
            <MissionList ref="missionList" class="missionListPanel"></MissionList>
          </el-tab-pane>
        </template>
        <template v-else-if="identity === 'district'">
          <el-tab-pane label="主表单" name="mainForm">
            <MainForm
              ref="mainForm"
              @closeLoading="closeLoading"
              :mainFormTableSource="mainFormTableSource"
              class="mainFormPanel"
              :mainFormInputDisabled="inputDisabled"></MainForm>
          </el-tab-pane>
          <el-tab-pane label="区部附表" name="districtSchedule">
            <DistrictScheduleTable ref="districtScheduleTable" class="districtSchedulePanel"></DistrictScheduleTable>
          </el-tab-pane>
          <el-tab-pane label="任务单" name="missionList">
            <MissionList ref="missionList" class="missionListPanel"></MissionList>
          </el-tab-pane>
        </template>
        <template v-else>
          <el-tab-pane label="主表单" name="mainForm">
            <MainForm
              :mainFormTableSource="mainFormTableSource"
              :mainFormInputDisabled="inputDisabled"
              @closeLoading="closeLoading"
              class="mainFormPanel"
              ref="mainForm"></MainForm>
          </el-tab-pane>
          <el-tab-pane label="任务单" name="missionList">
            <MissionList ref="missionList" class="missionListPanel"></MissionList>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { MessageBox, Message } from 'element-ui';
import MainForm from '../components/mainForm/mainForm.vue';
import ScheduleTable from '../components/scheduleTable/scheduleTable.vue';
import DistrictScheduleTable from '../components/districtSchedule/districtSchedule.vue';
import OperatingIncome from '../components/operatingIncome/operatingIncome.vue';
import MissionList from '../components/missonList/missionList.vue';
import api from '@/http/index';
import news from '@/assets/js/notification';

Vue.component(MessageBox.name, MessageBox);
Vue.use(api);

export default {
  name: 'Container',
  components: {
    MainForm, ScheduleTable, OperatingIncome, MissionList, DistrictScheduleTable,
  },
  data() {
    return {
      monthUserID: '',
      monthCreateByUser: '',
      monthViewEditorYear: '',
      monthViewEditorMonth: '',
      monthFromWhichBtn: '',
      responseData: {},
      submitBtnShow: true,
      UnitName: '',
      review: 0,
      allSubmissionData: {},
      loadingCover: '',
      showReviewAndReject: false,
      showDraftAndSubmit: false,
      reachMatchAdjustment: false,
      inputDisabled: false,
      identity: '',
      // isBehind: true, // 判断是否为幕僚,幕僚没有附表和营业收入
      selectTabPane: this.$store.state.comData.selectTabPane || 'mainForm',
      mainFormTableSource: '',
      ReviewStatus: '',
      SupervisorID: '',
      // monthFromWhichBtn = '0' 代表从新增按钮过来的
      // monthFromWhichBtn = '1' 代表从查看编辑过来的
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
    closeLoading() {
      this.loadingCover.close();
    },
    tabClick(el) {
      this.$store.commit('setSelectTabPane', el.name);
    },
    getBaseInfo() {
      this.monthUserID = sessionStorage.getItem('userID');
      this.monthFromWhichBtn = news.getQueryVariable('monthFromWhichBtn');
      if (this.monthFromWhichBtn === '1') {
        this.monthCreateByUser = decodeURI(news.getQueryVariable('monthCreateByUser'));
        this.monthViewEditorYear = news.getQueryVariable('monthViewEditorYear');
        this.monthViewEditorMonth = news.getQueryVariable('monthViewEditorMonth');
      }
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
      switch (true) {
        case this.identity === 'store':
          this.$refs.scheduleTable.getScheduleSubmissionData();
          this.$refs.operateIncome.getAllOperateSubmissionData();
          break;
        case this.identity === 'district':
          this.$refs.districtScheduleTable.getDistrictScheduleSubmissionData();
          break;
        default:
          break;
      }
      this.$refs.missionList.editorSubmission();
      this.setAllSubmissionData();
    },
    getQueryAddYear() {
      if (this.monthFromWhichBtn === '1') {
        return this.monthViewEditorYear;
      }
      if (this.monthFromWhichBtn === '0') {
        if (new Date().getMonth() + 2 === 13) {
          return new Date().getFullYear() + 1;
        }
        return new Date().getFullYear();
      }
      return '';
    },
    getQueryAddMonth() {
      if (this.monthFromWhichBtn === '1') {
        return this.monthViewEditorMonth;
      }
      if (this.monthFromWhichBtn === '0') {
        if (new Date().getMonth() + 2 === 13) {
          return 1;
        }
        return new Date().getMonth() + 2;
      }
      return '';
    },
    setAllSubmissionData() {
      this.allSubmissionData = {};
      const storeCommonData = this.$store.state.comData.commonData;
      // this.allSubmissionData.Years = new Date().getFullYear();
      this.allSubmissionData.Years = this.getQueryAddYear();
      // this.allSubmissionData.Month = new Date().getMonth() + 2;
      // this.allSubmissionData.Month = 5;
      // TODO:这里代码需要改回来;
      // this.allSubmissionData.Month = this.getQueryAddMonth();
      // TODO:上一行的代码改回来;
      this.allSubmissionData.Month = 1;
      this.allSubmissionData.MonthlyPlanID = storeCommonData.MPID;
      this.allSubmissionData.CostCode = storeCommonData.Pr0139;
      this.allSubmissionData.OrganizeId = storeCommonData.OrganizeId;
      this.allSubmissionData.ParentId = storeCommonData.ParentId;
      this.allSubmissionData.Company = storeCommonData.Company;
      this.allSubmissionData.District = storeCommonData.District;
      this.allSubmissionData.department = storeCommonData.DepartmentAttribute;
      this.allSubmissionData.City = storeCommonData.City;
      this.allSubmissionData.Review = this.review;// 保存草稿为0；数据提交为1；
      this.allSubmissionData.CreateByUser = storeCommonData.userID;
      this.allSubmissionData.F_RealName = storeCommonData.F_RealName;
      this.allSubmissionData.OrganizeName = storeCommonData.UnitName;
      this.allSubmissionData.Pr0111 = storeCommonData.Pr0111;
      this.allSubmissionData.Amoeba_MonthlyPlandetails = this.$store.state.mainForm.mainFormData;
      const AdjustmentList = this.$store.state.districtSchedule.signingFeeAdjustmentData.concat(this.$store.state.districtSchedule.businessAdjustmentData);
      switch (true) {
        case this.identity === 'store':
          this.allSubmissionData.MonthSigningGoldYD = this.$store.state.operatingForm.operatingFormData;
          this.allSubmissionData.MonthPerformanceYD = this.$store.state.operatingForm.performanceFormData;
          this.allSubmissionData.Amoeba_MonthlySSDetail = this.$store.state.scheduleForm.scheduleFormData;
          break;
        case this.identity === 'district':
          this.allSubmissionData.Amoeba_MonthAreaFBDetail = this.$store.state.districtSchedule.MonthAreaFB;
          this.allSubmissionData.Amoeba_AdjustmentList = AdjustmentList;
          break;
        default:
          this.allSubmissionData.MonthSigningGoldYD = [];
          this.allSubmissionData.MonthPerformanceYD = [];
          this.allSubmissionData.Amoeba_MonthlySSDetail = [];
          break;
      }
      // if (this.isBehind) {
      //   this.allSubmissionData.MonthSigningGoldYD = [];
      //   this.allSubmissionData.MonthPerformanceYD = [];
      //   this.allSubmissionData.Amoeba_MonthlySSDetail = [];
      // } else {
      //   this.allSubmissionData.MonthSigningGoldYD = this.$store.state.operatingForm.operatingFormData;
      //   this.allSubmissionData.MonthPerformanceYD = this.$store.state.operatingForm.performanceFormData;
      //   this.allSubmissionData.Amoeba_MonthlySSDetail = this.$store.state.scheduleForm.scheduleFormData;
      // }
      this.allSubmissionData.Amoeba_TaskForm = this.$store.state.missionList.missionListData;
      console.log(this.allSubmissionData);
      this.$api.monthMainAndScheduleSub(this.allSubmissionData)
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
            // window.location.reload();
            /* TODO:正式环境的时候reload需要，但是现在不需要 */
          }
        })
        .catch((err) => {
          console.log(err);
          this.loadingCover.close();
          news.ElErrorMessage(err);
        });
    },
    monthJudgeInputDisabled() {
      // ReviewStatus = '' 未填写
      // ReviewStatus = '0' 填写中
      // ReviewStatus = '1' 待审核
      // ReviewStatus = '2' 审核通过
      // ReviewStatus = '3' 驳回
      // monthFromWhichBtn = '0' 表示是新增的；
      // monthFromWhichBtn = '１' 表示是查询编辑的；
      if (this.monthFromWhichBtn === '0') {
        this.showReviewAndReject = false;
        this.reachMatchAdjustment = this.ReviewStatus === '2' && (new Date().getMonth() + 1) === (Number(this.monthViewEditorMonth) + 1);
        this.showDraftAndSubmit = this.ReviewStatus === '' || this.ReviewStatus === '0' || this.ReviewStatus === '3';
        this.inputDisabled = this.ReviewStatus === '1' || this.ReviewStatus === '2';
      } else if (this.monthUserID !== this.monthCreateByUser) {
        this.reachMatchAdjustment = false;
        this.showDraftAndSubmit = false;
        this.inputDisabled = true;
        // TODO:跨级不能审核,跨月份也不能审核
        this.showReviewAndReject = this.ReviewStatus === '1' && Number(this.monthViewEditorMonth) === (new Date().getMonth() + 1) && this.monthUserID === this.SupervisorID;
      } else {
        this.reachMatchAdjustment = this.ReviewStatus === '2' && (new Date().getMonth() + 1) === (Number(this.monthViewEditorMonth) + 1);
        this.showReviewAndReject = false;
        this.showDraftAndSubmit = this.ReviewStatus === '' || this.ReviewStatus === '0' || this.ReviewStatus === '3';
        this.inputDisabled = !(this.ReviewStatus !== '1' && this.ReviewStatus !== '2');
      }
      this.$store.commit('setInputDisabled', this.inputDisabled);
      this.$store.commit('setShowDraftAndSubmit', this.showDraftAndSubmit);
    },
    reviewAndReject(index) {
      this.$api.queryAndAddedQuery({
        MPID: this.$store.state.comData.commonData.MPID,
        status: index,
        User: this.monthUserID,
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
        news.ElErrorMessage(errMsg);
      });
    },
    indexFirstLoadingRequest() {
      let paramsArgs;
      if (this.monthFromWhichBtn === '0') {
        paramsArgs = {
          userID: this.monthUserID,
          IsYM: 1,
          Year: new Date().getFullYear(),
          // TODO:production change
          // Month: new Date().getMonth() + 2,
          // TODO: end
          Month: 1,
        };
      }
      if (this.monthFromWhichBtn === '1') {
        paramsArgs = {
          userID: this.monthCreateByUser,
          IsYM: 1,
          Year: this.monthViewEditorYear,
          Month: this.monthViewEditorMonth,
        };
      }
      // const params = {
      //   userID: this.userID,
      //   IsYM: 1,
      //   Year: new Date().getFullYear(),
      //   Month: new Date().getMonth() + 1,
      // };
      console.log(paramsArgs);
      this.$api.yearLoadingData(paramsArgs).then((res) => {
        console.log(JSON.parse(res.data));
        this.responseData = JSON.parse(res.data);
        this.UnitName = this.responseData.UnitName;
        this.ReviewStatus = this.responseData.ReviewStatus;
        this.SupervisorID = this.responseData.SupervisorID;
        this.mainFormTableSource = JSON.parse(res.data).list;
        console.log(this.mainFormTableSource);
        this.commitComData();
        this.monthJudgeInputDisabled();
      }).catch((errMsg) => {
        console.log(errMsg);
        this.loadingCover.close();
        news.ElErrorMessage(errMsg);
      });
    },
    commitComData() {
      const comDataObj = {};
      comDataObj.userID = this.monthUserID;
      comDataObj.City = this.responseData.City;
      comDataObj.Company = this.responseData.Company;
      comDataObj.DepartmentAttribute = this.responseData.DepartmentAttribute;
      comDataObj.District = this.responseData.District;
      comDataObj.F_RealName = this.responseData.F_RealName;
      comDataObj.JobAttribute = this.responseData.JobAttribute;
      comDataObj.MPID = this.responseData.MPID;
      comDataObj.OrganizeId = this.responseData.OrganizeId;
      comDataObj.ParentId = this.responseData.ParentId;
      comDataObj.Pr0111 = this.responseData.Pr0111;
      comDataObj.Pr0139 = this.responseData.Pr0139;
      comDataObj.SupervisorNumber = this.responseData.SupervisorNumber;
      comDataObj.UnitName = this.responseData.UnitName;
      comDataObj.draft = this.responseData.draft;
      comDataObj.ReviewStatus = this.responseData.ReviewStatus;
      comDataObj.SupervisorID = this.responseData.SupervisorID;
      // Pr0111为'A1'或者'C1'或者'B0'的时候为门店；
      // Pr0111为'A2'的时候为业务区；
      // 其他的情况就相当于是幕僚;
      switch (true) {
        case this.responseData.Pr0111 === 'A1' || this.responseData.Pr0111 === 'C1' || this.responseData.Pr0111 === 'B0':
          this.identity = 'store';
          break;
        case this.responseData.Pr0111 === 'A2':
          this.identity = 'district';
          break;
        default:
          this.identity = 'other';
          break;
      }
      comDataObj.identity = this.identity;
      this.$store.commit('setCommonData', comDataObj);
      // TODO:这个暂时隐藏,后续打开
      this.$nextTick(() => {
        this.$refs.mainForm.mainFormFirstLoading();
        switch (true) {
          case this.identity === 'store':
            this.$refs.scheduleTable.firstLoadingRequest();
            break;
          case this.identity === 'district':
            this.$refs.districtScheduleTable.districtRequest();
            break;
          default:
            break;
        }
        this.$refs.missionList.missionListLoading();
      });
      // TODO:这个暂时隐藏,后续打开
    },

  },
  computed: {
    storeYearMonth() {
      if (this.monthFromWhichBtn === '1') {
        return this.UnitName + ' ' + this.monthViewEditorYear + '年' + this.monthViewEditorMonth + '月';
      }
      // TODO:正是环境改回来;
      // return this.index + ' ' + new Date().getFullYear() + '年' + (new Date().getMonth() + 2) + '月';
      if (this.monthFromWhichBtn === '0') {
        return this.UnitName + ' ' + new Date().getFullYear() + '年01月';
      }
      return '';
    },
  },
  mounted() {
    this.getBaseInfo();
    this.indexFirstLoadingRequest();
  },
  created() {
    // TODO:start先隐藏后续打开
    this.loadingCover = this.$loading({
      lock: true,
      text: 'Loading...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    // TODO:end;
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
