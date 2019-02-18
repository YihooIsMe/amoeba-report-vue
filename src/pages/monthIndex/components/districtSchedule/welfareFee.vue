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
            <el-input
              placeholder="请输入金额"
              v-model="scope.row.Amount"
              clearable
              size="small"
              :ref="welfareFee(scope.$index)"
              :disabled="inputDisabled"
              @change="scheduleHandleInputNum(scope.$index, scope.row.Amount)"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue';
import { Message } from 'element-ui';

export default {
  name: 'welfareFee',
  props: ['welfareFeeList', 'inputDisabled'],
  data() {
    return {
    };
  },
  methods: {
    welfareFee(index) {
      return 'welfareFee' + index;
    },
    scheduleHandleInputNum(row, val) {
      if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(Number(val))) {
        Message({
          message: '请输入有效数字!',
          duration: 1000,
          type: 'warning',
        });
        console.log(row);
        console.log(Number(val));
        console.log(val);
        console.log('welfareFee' + row);
        console.log(this.$refs['welfareFee' + row]);
        this.$refs['welfareFee' + row].focus();
        return false;
      }
      return true;
    },
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
