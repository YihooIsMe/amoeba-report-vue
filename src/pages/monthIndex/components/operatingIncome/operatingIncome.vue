<template>
  <div class="operating-income">
    营业收入（白色为预定，灰色为实际）
    <div class="child-operating-income">
      <el-button type="primary" plain size="small" @click="dialogTableVisible = true">新增</el-button>
      <el-button type="success" plain size="small">删除</el-button>
      <el-button type="warning" plain size="small" @click="achieveAdjustmentVisible = true">达成匹配调整</el-button>
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="预定别"
          width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="状态"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="经纪人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="种类">
        </el-table-column>
        <el-table-column
          label="客户姓名">
        </el-table-column>
        <el-table-column
          label="案件名称/需求简介">
        </el-table-column>
        <el-table-column
          label="目前情况">
        </el-table-column>
        <el-table-column
          label="达成可能性">
        </el-table-column>
        <el-table-column
          label="全佣签约金">
        </el-table-column>
        <el-table-column
          label="折让中人">
        </el-table-column>
        <el-table-column
          label="折让中人">
        </el-table-column>
        <el-table-column
          label="全佣签约金实际">
        </el-table-column>
      </el-table>
    </div>
    <div class="performance-title">业绩收入（白色为预定，灰色为实际）</div>
    <div class="child-performance-income">
      <el-button type="primary" plain size="small">新增</el-button>
      <el-button type="success" plain size="small">删除</el-button>
      <el-button type="warning" plain size="small">达成匹配调整</el-button>
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="预定别"
          width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="状态"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="经纪人"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="种类">
        </el-table-column>
        <el-table-column
          label="客户姓名">
        </el-table-column>
        <el-table-column
          label="案件名称/需求简介">
        </el-table-column>
        <el-table-column
          label="目前情况">
        </el-table-column>
        <el-table-column
          label="达成可能性">
        </el-table-column>
        <el-table-column
          label="全佣签约金">
        </el-table-column>
        <el-table-column
          label="折让中人">
        </el-table-column>
        <el-table-column
          label="折让中人">
        </el-table-column>
        <el-table-column
          label="全佣签约金实际">
        </el-table-column>
      </el-table>
    </div>
    <OperatingAdd
      :dialogTableVisible="dialogTableVisible"
      @changeDialogShow="getDialogShow"></OperatingAdd>
    <AchieveAdjustment
      :achieveAdjustmentVisible="achieveAdjustmentVisible"
      @closeAchieveDialog="getAchieveDialog"></AchieveAdjustment>
  </div>
</template>

<script>
import OperatingAdd from './operatingAdd.vue';
import AchieveAdjustment from './achieveAdjustment.vue';

export default {
  name: 'operatingIncome',
  components: { AchieveAdjustment, OperatingAdd },
  data() {
    return {
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: [],
      dialogTableVisible: false,
      achieveAdjustmentVisible: false,
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getDialogShow(newVal) {
      this.dialogTableVisible = newVal;
    },
    getAchieveDialog(newVal) {
      this.achieveAdjustmentVisible = newVal;
    },
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
