<template>
  <div class="signingFeeAdjustment">
    <el-card>
      <el-button type="primary" icon="el-icon-circle-plus" size="medium">新增</el-button>
      <el-button type="warning" icon='el-icon-remove' size="medium">删除</el-button>
      <el-table
        ref="multipleTable"
        :data="signingFeeAdjustmentData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="客户名/案名"
          width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="店名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="预定金额">
        </el-table-column>
        <el-table-column
          prop="address"
          label="店名">
        </el-table-column>
        <el-table-column
          prop="address"
          label="预定金额">
        </el-table-column>
        <el-table-column
          prop="address"
          label="调减签约金">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'signingFeeAdjustment',
  data() {
    return {
      signingFeeAdjustmentData: [],
      multipleSelection: [],
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style scoped>

</style>
