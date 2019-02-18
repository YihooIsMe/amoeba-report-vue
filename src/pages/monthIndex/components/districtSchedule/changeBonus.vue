<template>
  <div class="changeBonus">
    <el-card>
      <el-table
        :data="changeBonusList"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column
          prop="Name"
          label="奖励"
          width="300">
        </el-table-column>
        <el-table-column
          prop="Explain"
          label="说明"
          width="300">
        </el-table-column>
        <el-table-column
          label="金额">
          <template scope="scope">
            <el-input
              placeholder="请输入金额"
              v-model="scope.row.Amount"
              clearable
              size="small"
              :disabled="inputDisabled"
              ref="changeBonusInput"
              @change="scheduleHandleInputNum"></el-input>
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
  name: 'changeBonus',
  props: ['changeBonusList', 'inputDisabled'],
  data() {
    return {
    };
  },
  methods: {
    scheduleHandleInputNum() {
      if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(Number(this.changeBonusList[0].Amount))) {
        Message({
          message: '请输入有效数字!',
          duration: 1000,
          type: 'warning',
        });
        Vue.set(this.changeBonusList[0], 'Amount', '');
        this.$refs.changeBonusInput.focus();
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
        if (index === 2) {
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
        }
      });
      if (sums.length > 0 && sums[2] !== 'N/A') {
        this.$emit('giveSumChangeBonus', Math.round(sums[2]));
      } else {
        this.$emit('giveSumChangeBonus', 0);
      }
      return sums;
    },
  },
};
</script>

<style scoped>

</style>
