<template>
  <div class="welfareFee">
    <el-card>
      <el-table
        :data="welfareFeeData"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column
          prop="project"
          label="项目"
          width="450">
        </el-table-column>
        <el-table-column
          label="金额">
          <template slot-scope="scope">
            <el-input placeholder="请输入金额" v-model="scope.row.amount" clearable size="small"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'welfareFee',
  data() {
    return {
      welfareFeeData: [
        { project: '团建费', amount: 10 },
        { project: '阿米巴餐叙', amount: 10 },
        { project: '其他福利金（区部达成奖励等）', amount: 10 },
      ],
    };
  },
  methods: {
    getSummaries(param) {
      console.log(param);
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        const values = data.map(item => Number(item.amount));
        console.log(values);
        if (!values.every(value => Number.isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return prev + curr;
            }
            return prev;
          }, 0);
        } else {
          sums[index] = 'N/A';
        }
      });
      return sums;
    },
  },
};
</script>

<style scoped>

</style>
