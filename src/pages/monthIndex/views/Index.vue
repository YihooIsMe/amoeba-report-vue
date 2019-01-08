<template>
  <div>
    <div class="table-container">
      <h2>阿米巴核算系统--月预定</h2>
      <div class="submitBtn" v-if="submitBtnShow">
        <div class="top-left" v-if="!!index">
          {{index + " " + new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'}}
        </div>
        <div class="top-right">
          <el-button type="primary" @click="dataSubmission(0)">保存草稿</el-button>
          <el-button type="success" @click="dataSubmission(1)">数据提交</el-button>
          <el-button type="warning">Excel导出</el-button>
        </div>
      </div>
      <el-tabs type="border-card" class="tab-container" value="schedule">
        <el-tab-pane label="主表单">
          <MainForm @giveStore="getStore" ref="mainForm" id="mainFormPanel" @getScheduleTableData="getSonComData"></MainForm>
        </el-tab-pane>
        <el-tab-pane label="附表">
          <ScheduleTable ref="scheduleTable" id="schedulePanel"></ScheduleTable>
        </el-tab-pane>
        <el-tab-pane label="营业收入" name="schedule">
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
import MainForm from '../components/mainForm/mainForm.vue';
import ScheduleTable from '../components/scheduleTable/scheduleTable.vue';
import OperatingIncome from '../components/operatingIncome/operatingIncome.vue';
import MissionList from '../components/missonList/missionList.vue';
import api from '@/http/index';

Vue.use(api);

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
    };
  },
  methods: {
    getStore(val) {
      this.index = val;
    },
    getSonComData(val) {
      this.mainFormSonData = val;
      this.$refs.scheduleTable.firstLoadingRequest();
    },
    dataSubmission(index) {
      this.review = index;
      this.$refs.mainForm.getAllSubmissionData();
      this.$refs.scheduleTable.getScheduleSubmissionData();
      this.$refs.operateIncome.getAllOperateSubmissionData();
      this.setMainAndScheduleAllSubmissionData();
    },
    setMainAndScheduleAllSubmissionData() {
      const storeCommonData = this.$store.state.comData.commonData;
      this.mainAndScheduleAllSubmissionData.Years = new Date().getFullYear();
      this.mainAndScheduleAllSubmissionData.Month = new Date().getMonth() + 1;
      this.mainAndScheduleAllSubmissionData.MonthlyPlanID = storeCommonData.MPID;
      this.mainAndScheduleAllSubmissionData.CostCode = storeCommonData.Pr0139;
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
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getStore();
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
