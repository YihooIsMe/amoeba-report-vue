<template>
  <div class="withholdingBonusAdjustment">
    <el-card>
      <!--减项相关内容-->
      <el-table
        :data="withholdingBonusDeduction"
        border
        style="width: 100%">
        <el-table-column
          prop="Name"
          label="减项"
          width="180">
        </el-table-column>
        <el-table-column
          prop="Explain"
          label="说明"
          width="180">
        </el-table-column>
        <el-table-column
          prop="Amount"
          label="金额">
        </el-table-column>
      </el-table>
      <!--增项相关内容-->
      <el-table
        :data="withholdingBonusIncrement"
        border
        style="width: 100%">
        <el-table-column
          prop="Name"
          label="增项"
          width="180">
        </el-table-column>
        <el-table-column
          prop="Explain"
          label="说明"
          width="180">
        </el-table-column>
        <el-table-column
          prop="Amount"
          label="金额">
        </el-table-column>
      </el-table>
      <!--店预定数据-->
      <el-table
        :data="withholdingBonus"
        border
        style="width: 100%">
        <el-table-column
          prop="F_FullName"
          label="当月预定汇总"
          width="180">
        </el-table-column>
        <el-table-column
          prop="PerformanceYD"
          label="预定业绩"
          width="180">
        </el-table-column>
        <el-table-column
          prop="PerformanceSurplusYD"
          label="预定业绩盈余">
        </el-table-column>
        <el-table-column
          prop="ActualBonus"
          label="预提实绩奖(2%)">
        </el-table-column>
        <el-table-column
          prop="TotalOperatingIncome"
          label="预定签约金">
        </el-table-column>
        <el-table-column
          prop="SigningGoldSurplus"
          label="预定签约金盈余">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'withholdingBonusAdjustment',
  props: ['withholdingBonusDeduction', 'withholdingBonusIncrement', 'withholdingBonus'],
};
</script>

<style>
.withholdingBonusAdjustment .el-table:not(:first-child) {
  margin-top: 20px;
}
</style>
