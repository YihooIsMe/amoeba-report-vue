<template>
  <div>
    <div class="table-container">
      <h2>阿米巴核算系统--月预定</h2>
      <div class="submitBtn" v-if="submitBtnShow">
        <div class="top-left" v-if="!!store">
          {{store + " " + new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'}}
        </div>
        <div class="top-right">
          <el-button type="primary">保存草稿</el-button>
          <el-button type="success">数据提交</el-button>
          <el-button type="warning">Excel导出</el-button>
        </div>
      </div>
      <el-tabs type="border-card" class="tab-container" value="schedule">
        <el-tab-pane label="主表单">
          <MainForm @giveStore="getStore"></MainForm>
        </el-tab-pane>
        <el-tab-pane label="附表" name="schedule">
          <ScheduleTable></ScheduleTable>
        </el-tab-pane>
        <el-tab-pane label="营业收入">
          <OperatingIncome></OperatingIncome>
        </el-tab-pane>
        <el-tab-pane label="任务单">
          <MissionList></MissionList>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import MainForm from '../components/mainForm/mainForm.vue';
import ScheduleTable from '../components/scheduleTable/scheduleTable.vue';
import OperatingIncome from '../components/operatingIncome/operatingIncome.vue';
import MissionList from '../components/missonList/missionList.vue';

export default {
  name: 'Container',
  components: {
    MainForm, ScheduleTable, OperatingIncome, MissionList,
  },
  data() {
    return {
      submitBtnShow: true,
      store: '111',
    };
  },
  methods: {
    getStore(val) {
      this.store = val;
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
