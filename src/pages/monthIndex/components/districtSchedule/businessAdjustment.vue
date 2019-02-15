<template>
  <div class="businessAdjustment">
    <el-card>
      <el-button type="primary" icon="el-icon-circle-plus" size="medium" @click="dialogIsShow = true">新增</el-button>
      <el-button type="warning" icon='el-icon-remove' size="medium" @click="deleteEvent">删除</el-button>
      <el-table
        ref="multipleTable"
        :data="businessAdjustmentData"
        tooltip-effect="dark"
        style="width: 100%"
        :summary-method="getSummaries"
        show-summary
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="80">
        </el-table-column>
        <el-table-column
          label="客户名/案名"
          width="120">
          <template slot-scope="scope">{{ scope.row.Name }}</template>
        </el-table-column>
        <el-table-column
          prop="OrganizeName_A"
          label="店名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="YDAmount_A"
          label="预定金额">
        </el-table-column>
        <el-table-column
          prop="OrganizeName_B"
          label="店名">
        </el-table-column>
        <el-table-column
          prop="YDAmount_B"
          label="预定金额">
        </el-table-column>
        <el-table-column
          prop="AdjustmentAmount"
          label="调减业绩">
        </el-table-column>
      </el-table>
    </el-card>
    <BusinessAdjustmentAdd
      ref="businessAdjustmentAdd"
      :dialogIsShow="dialogIsShow"
      @changeDialogShow="changeDialogShow" @setBusinessAdjustmentForm="getBusinessAdjustmentForm"></BusinessAdjustmentAdd>
  </div>
</template>

<script>
import BusinessAdjustmentAdd from './businessAdjustmentAdd.vue';

export default {
  name: 'businessAdjustment',
  components: { BusinessAdjustmentAdd },
  data() {
    return {
      dialogIsShow: false,
      businessAdjustmentData: [],
      multipleSelection: [],
      selectedIndexArr: [],
    };
  },
  methods: {
    // TODO:test git
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeDialogShow(val) {
      this.dialogIsShow = val;
    },
    getBusinessAdjustmentForm(val) {
      const obj = {};
      obj.Name = val.Name;
      obj.OrganizeName_A = val.OrganizeName_A;
      obj.YDAmount_A = val.YDAmount_A;
      obj.OrganizeName_B = val.OrganizeName_B;
      obj.YDAmount_B = val.YDAmount_B;
      obj.AdjustmentAmount = val.AdjustmentAmount;
      this.businessAdjustmentData.push(obj);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 6) {
          const values = data.map(item => Number(item[column.property]));
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
      if (sums.length > 0 && sums[6] !== 'N/A') {
        this.$emit('giveSumBusinessAdjustment', Math.round(sums[6]));
      }
      return sums;
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    deleteEvent() {
      if (this.multipleSelection.length !== 0) {
        const arr = [];
        this.multipleSelection.forEach((item) => {
          arr.push(item.index);
        });
        this.selectedIndexArr = arr.sort(this.sortArr);
        console.log(this.selectedIndexArr);
        if (this.multipleSelection.length === this.businessAdjustmentData.length) {
          this.businessAdjustmentData = [];
        } else {
          for (let i = this.selectedIndexArr.length - 1; i >= 0; i -= 1) {
            this.businessAdjustmentData.splice(this.selectedIndexArr[i], 1);
          }
        }
      }
    },
    sortArr(a, b) {
      return a - b;
    },
    getBusinessAdjustment() {
      const submitBusinessAdjustmentData = [];
      this.businessAdjustmentData.forEach((item) => {
        const obj = {};
        obj.MonthlyPlanID = this.$store.state.comData.commonData.MPID;
        obj.OrganizeName_A = item.OrganizeName_A;
        obj.YDAmount_A = item.YDAmount_A;
        obj.OrganizeName_B = item.OrganizeName_B;
        obj.YDAmount_B = item.YDAmount_B;
        obj.AdjustmentAmount = item.AdjustmentAmount;
        obj.Name = item.Name;
        obj.type = 1;
        submitBusinessAdjustmentData.push(obj);
      });
      this.$store.commit('setBusinessAdjustmentData', submitBusinessAdjustmentData);
    },
  },
};
</script>

<style scoped>

</style>
