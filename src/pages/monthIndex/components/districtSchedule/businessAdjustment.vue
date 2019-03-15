<template>
  <div class="businessAdjustment">
    <el-card>
      <el-button type="primary" icon="el-icon-circle-plus" size="medium" @click="newAdd">新增</el-button>
      <el-button type="warning" icon="el-icon-edit" size="medium" @click="modify">修改</el-button>
      <el-button type="danger" icon='el-icon-remove' size="medium" @click="deleteEvent">删除</el-button>
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
          :selectable="checkSelectable"
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
import Vue from 'vue';
import { Message } from 'element-ui';
import BusinessAdjustmentAdd from './businessAdjustmentAdd.vue';

export default {
  name: 'businessAdjustment',
  components: { BusinessAdjustmentAdd },
  props: ['businessAdjustment', 'inputDisabled'],
  data() {
    return {
      dialogIsShow: false,
      businessAdjustmentData: this.businessAdjustment,
      multipleSelection: [],
      selectedIndexArr: [],
    };
  },
  methods: {
    checkSelectable() {
      // 数据提交保存之后变为不可选;
      return this.inputDisabled === false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeDialogShow(val) {
      this.dialogIsShow = val;
    },
    getBusinessAdjustmentForm(val) {
      console.log(val);
      if (val.type === 'newAdd') {
        const obj = {};
        obj.Name = val.Name;
        obj.OrganizeName_A = val.OrganizeName_A;
        obj.YDAmount_A = val.YDAmount_A;
        obj.OrganizeName_B = val.OrganizeName_B;
        obj.YDAmount_B = val.YDAmount_B;
        obj.AdjustmentAmount = val.AdjustmentAmount;
        this.businessAdjustmentData.push(obj);
      }
      if (val.type === 'modify') {
        const arrayList = ['Name', 'OrganizeName_A', 'YDAmount_A', 'OrganizeName_B', 'YDAmount_B', 'AdjustmentAmount'];
        arrayList.forEach((el) => {
          Vue.set(this.businessAdjustmentData[val.index], el, val[el]);
        });
      }
    },
    newAdd() {
      this.dialogIsShow = true;
      this.$refs.businessAdjustmentAdd.doNewAdd();
    },
    modify() {
      if (this.multipleSelection.length === 1) {
        const selectedForm = this.businessAdjustmentData[this.multipleSelection[0].index];
        const formData = {};
        const arrayList = ['index', 'Name', 'OrganizeName_A', 'YDAmount_A', 'OrganizeName_B', 'YDAmount_B', 'AdjustmentAmount'];
        arrayList.forEach((el) => {
          formData[el] = selectedForm[el];
        });
        formData.type = 'modify';
        this.dialogIsShow = true;
        this.$refs.businessAdjustmentAdd.doModify(formData);
      } else {
        Message({
          message: '您仅能选择一条信息进行修改!',
          type: 'error',
          duration: 2000,
        });
      }
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
          this.$emit('giveSumBusinessAdjustment', 0);
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
