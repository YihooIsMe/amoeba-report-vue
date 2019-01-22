<template>
  <el-dialog
    title="达成匹配调整"
    :visible.sync="copyAchieveAdjustmentVisible"
    width="30%"
    center
    @close="handleClose"
    custom-class="achieve-dialog"
    >
    <div class="achieve-dialog-content">
      <div>请选择本月分店的成交案件</div>
      <div class="radio">
        <template v-if="transactionCaseArr.length>0">
          <el-radio
            v-for="(item, index) in transactionCaseArr"
            :key="index"
            :label="item.ID"
            v-model="radio"
          >{{item.value}}</el-radio>
        </template>
        <template v-else>
          <div class="red">暂无数据</div>
        </template>
      </div>
      <div class="note">
        <span class="red">*</span>只能调月预定案件，预定和实际的客户类别必须一致，同一案子同一客户类别只能匹配一条月预定记录
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="copyAchieveAdjustmentVisible = false">取 消</el-button>
    <el-button type="primary" @click="transactionCaseSubmit">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue';
import { Radio } from 'element-ui';
import api from '@/http/index';

Vue.use(Radio);
Vue.use(api);

export default {
  name: 'achieveAdjustment',
  props: ['achieveAdjustmentVisible', 'multipleSelection'],
  data() {
    return {
      copyAchieveAdjustmentVisible: this.achieveAdjustmentVisible,
      radio: '1',
      transactionCaseArr: [],
    };
  },
  watch: {
    achieveAdjustmentVisible(newVal) {
      this.copyAchieveAdjustmentVisible = newVal;
    },
  },
  methods: {
    handleClose() {
      this.$emit('closeAchieveDialog', false);
    },
    getTransactionCase() {
      // TODO:这里的月份不是死的,后续修改
      this.$api.monthScheduleTable({ OrganizationID: this.$store.state.comData.commonData.OrganizeId, years: new Date().getFullYear() + '01' })
        .then((res) => {
          console.log(JSON.parse(res.data));
          JSON.parse(res.data).forEach((el) => {
            const obj = {};
            obj.CaseName = el.CaseName;
            obj.value = el.value;
            obj.CustomerID = el.CustomerID;
            obj.CustomerType = el.CustomerType;
            obj.CustomerName = el.CustomerName;
            obj.ID = el.ID;
            this.transactionCaseArr.push(obj);
          });
          if (this.transactionCaseArr.length > 0) {
            this.radio = this.transactionCaseArr[0].ID;
          }
        })
        .catch((errMsg) => {
          console.log(errMsg);
        });
    },
    transactionCaseSubmit() {
      let i;
      this.copyAchieveAdjustmentVisible = false;
      this.transactionCaseArr.forEach((el, index) => {
        if (el.ID === this.radio) {
          i = index;
          return '';
        }
        return '';
      });
      const params = {};
      params.CaseName = this.transactionCaseArr[i].CaseName;
      params.CustomerID = this.transactionCaseArr[i].CustomerID;
      params.CustomerName = this.transactionCaseArr[i].CustomerName;
      if (this.multipleSelection.length === 1) {
        params.ID = this.multipleSelection[0].ID;
      }
      console.log(params);
      this.$api.monthTransactionCase(params)
        .then((res) => {
          console.log(res);
        })
        .catch((errMsg) => {
          console.log(errMsg);
        });
    },
  },
};
</script>

<style scoped>

</style>
<style lang="less" scoped>
  .red{
    color: red;
    vertical-align: middle;
  }
.achieve-dialog{
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  .el-dialog__header{
    background-color: #E6A23C;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding-top: 15px;
    .el-dialog__title{
      color: #ffffff;
    }
    i:before{
      color:white;
    }
    .el-dialog__headerbtn{
      top:18px;
    }
  }
  .el-dialog__body{
    padding-bottom: 10px;
  }
  .achieve-dialog-content{
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    font-size: 16px;
    .el-radio__label{
      font-size: 16px;
    }
    .radio{
      padding-left: 30px;
      margin-top: 20px;
      .el-radio:last-child{
        margin-top: 10px;
      }
    }
    .note{
      margin-top: 20px;
    }
  }
  .el-dialog__body{
    padding-top: 10px;
  }
}
</style>
