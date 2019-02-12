<template>
  <div class="changeBonus">
    <el-card>
      <el-table
        :data="changeBonusData"
        border
        style="width: 100%">
        <el-table-column
          prop="reward"
          label="奖励"
          width="300">
        </el-table-column>
        <el-table-column
          prop="description"
          label="说明"
          width="300">
        </el-table-column>
        <el-table-column
          label="金额">
          <template scope="scope">
            <el-input placeholder="请输入金额" v-model="scope.row.amount" clearable size="small"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'changeBonus',
  data() {
    return {
      changeBonusData: [{
        reward: '区主管当月实发奖金',
        description: '前半年盈余',
        amount: 1000,
      }],
    };
  },
};
</script>

<style scoped>

</style>
