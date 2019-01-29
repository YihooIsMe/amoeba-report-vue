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
import VueCookie from 'vue-cookie';
import { MessageBox, Message } from 'element-ui';
import MainForm from '../components/mainForm/mainForm.vue';
import ScheduleTable from '../components/scheduleTable/scheduleTable.vue';
import OperatingIncome from '../components/operatingIncome/operatingIncome.vue';
import MissionList from '../components/missonList/missionList.vue';
import api from '@/http/index';
import news from '@/assets/js/notification';

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
      monthUserID: '',
      monthCreateByUser: '',
      monthViewEditorYear: '',
      monthViewEditorMonth: '',
      monthFromWhichBtn: '',
      responseData: {},
      submitBtnShow: true,
      index: '',
      UnitName: '',
      review: 0,
      allSubmissionData: {},
      loadingCover: '',
      monthFillStatus: '',
      showReviewAndReject: false,
      showDraftAndSubmit: false,
      reachMatchAdjustment: false,
      inputDisabled: false,
      isBehind: true, // 判断是否为幕僚,幕僚没有附表和营业收入
      selectTabPane: this.$store.state.comData.selectTabPane || 'mainForm',
      mainFormTableSource: '',
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
    getCookie() {
      this.monthUserID = VueCookie.get('monthUserID');
      this.monthCreateByUser = VueCookie.get('monthCreateByUser');
      this.monthViewEditorYear = VueCookie.get('monthViewEditorYear');
      this.monthViewEditorMonth = VueCookie.get('monthViewEditorMonth');
      this.monthFillStatus = VueCookie.get('monthFillStatus');
      this.monthFromWhichBtn = VueCookie.get('monthFromWhichBtn');
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
      this.$refs.missionList.editorSubmission();
      this.setAllSubmissionData();
    },
    getQueryAddYear() {
      if (this.monthFromWhichBtn === 'viewEditorBtn') {
        return this.monthViewEditorYear;
      }
      if (this.monthFromWhichBtn === 'newAdded') {
        if (new Date().getMonth() + 2 === 13) {
          return new Date().getFullYear() + 1;
        }
        return new Date().getFullYear();
      }
      return '';
    },
    getQueryAddMonth() {
      if (this.monthFromWhichBtn === 'viewEditorBtn') {
        return this.monthViewEditorMonth;
      }
      if (this.monthFromWhichBtn === 'newAdded') {
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
      if (this.isBehind) {
        this.allSubmissionData.MonthSigningGoldYD = [];
        this.allSubmissionData.MonthPerformanceYD = [];
        this.allSubmissionData.Amoeba_MonthlySSDetail = [];
      } else {
        this.allSubmissionData.MonthSigningGoldYD = this.$store.state.operatingForm.operatingFormData;
        this.allSubmissionData.MonthPerformanceYD = this.$store.state.operatingForm.performanceFormData;
        this.allSubmissionData.Amoeba_MonthlySSDetail = this.$store.state.scheduleForm.scheduleFormData;
      }
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
            VueCookie.set('monthFillStatus', '待审核');
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
      if (this.monthFromWhichBtn === 'newAdded') {
        this.showReviewAndReject = false;
        this.reachMatchAdjustment = this.monthFillStatus === '审核通过' && (new Date().getMonth() + 1) === (Number(this.monthViewEditorMonth) + 1);
        this.showDraftAndSubmit = this.monthFillStatus === '未填写' || this.monthFillStatus === '填写中' || this.monthFillStatus === '驳回';
        this.inputDisabled = this.monthFillStatus === '待审核' || this.monthFillStatus === '审核通过';
      } else if (this.monthUserID !== this.monthCreateByUser) {
        this.reachMatchAdjustment = false;
        this.showDraftAndSubmit = false;
        this.inputDisabled = true;
        // TODO:跨级不能审核,跨月份也不能审核
        this.showReviewAndReject = this.monthFillStatus === '待审核' && Number(this.monthViewEditorMonth) === (new Date().getMonth() + 1);
      } else {
        this.reachMatchAdjustment = this.monthFillStatus === '审核通过' && (new Date().getMonth() + 1) === (Number(this.monthViewEditorMonth) + 1);
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
      this.loadingCover = this.$loading({
        lock: true,
        text: 'Loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      let paramsArgs;
      if (this.monthFromWhichBtn === 'newAdded') {
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
      if (this.monthFromWhichBtn === 'viewEditorBtn') {
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
      this.$api.yearLoadingData(paramsArgs).then((res) => {
        console.log(JSON.parse(res.data));
        this.responseData = JSON.parse(res.data);
        this.UnitName = this.responseData.UnitName;
        this.mainFormTableSource = JSON.parse(res.data).list;
        this.commitComData();
      }).catch((errMsg) => {
        console.log(errMsg);
        this.loadingCover.close();
        news.ElErrorMessage(errMsg);
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
      comDataObj.ParentId = this.responseData.ParentId;
      comDataObj.Pr0111 = this.responseData.Pr0111;
      comDataObj.Pr0139 = this.responseData.Pr0139;
      comDataObj.SupervisorNumber = this.responseData.SupervisorNumber;
      comDataObj.UnitName = this.responseData.UnitName;
      comDataObj.draft = this.responseData.draft;
      this.$store.commit('setCommonData', comDataObj);
      this.isBehind = this.$store.state.comData.commonData.JobAttribute === '04';
      this.$nextTick(() => {
        this.$refs.mainForm.mainFormFirstLoading();
        this.$refs.missionList.missionListLoading();
        if (!this.isBehind) {
          this.$refs.scheduleTable.firstLoadingRequest();
        }
      });
    },

  },
  computed: {
    storeYearMonth() {
      if (this.monthFromWhichBtn === 'viewEditorBtn') {
        return this.UnitName + ' ' + this.monthViewEditorYear + '年' + this.monthViewEditorMonth + '月';
      }
      // TODO:正是环境改回来;
      // return this.index + ' ' + new Date().getFullYear() + '年' + (new Date().getMonth() + 2) + '月';
      return this.UnitName + ' ' + new Date().getFullYear() + '年01月';
    },
  },
  mounted() {
    this.monthJudgeInputDisabled();
    this.indexFirstLoadingRequest();
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
