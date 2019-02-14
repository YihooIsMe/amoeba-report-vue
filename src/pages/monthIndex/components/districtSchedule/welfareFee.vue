<template>
  <div class="welfareFee">
    <el-card>
      <el-table
        :data="welfareFeeList"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column
          prop="Name"
          label="项目"
          width="450">
        </el-table-column>
        <el-table-column
          label="金额">
          <template slot-scope="scope">
            <el-input placeholder="请输入金额" v-model="scope.row.Amount" clearable size="small"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'welfareFee',
  props: ['welfareFeeList'],
  data() {
    return {
    };
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item.Amount));
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
      if (sums.length > 0 && sums[1] !== 'N/A') {
        this.$emit('giveSumWelfareFee', Math.round(sums[1]));
      }
      return sums;
    },
  },
};
</script>

<style scoped>

</style>
