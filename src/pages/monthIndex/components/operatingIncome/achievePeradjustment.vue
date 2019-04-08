<template>
  <el-dialog
    title="达成匹配调整"
    :visible.sync="copyPerAchieveAdjustmentVisible"
    width="550px"
    center
    @close="handleClose"
    custom-class="achieve-dialog"
  >
    <div class="achieve-dialog-content">
      <div>请选择本月分店的成交案件</div>
      <div class="radio">
        <template v-if="perTransactionCaseArr.length>0">
          <el-col :span="12" v-for="(item, index) in perTransactionCaseArr" :key="index">
            <el-radio
              :label="item.ID"
              v-model="radio"
            >{{item.value}}</el-radio>
          </el-col>
        </template>
        <template v-else>
          <div class="red noData">暂无数据</div>
        </template>
      </div>
      <div class="note">
        <span class="red">*</span>只能调月预定案件，预定和实际的客户类别必须一致，同一案子同一客户类别只能匹配一条月预定记录
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="copyPerAchieveAdjustmentVisible = false">取 消</el-button>
    <el-button type="primary" @click="perTransactionCaseSubmit">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue';
import { Radio } from 'element-ui';
import api from '@/http/index';
import news from '@/assets/js/notification';

Vue.use(Radio);
Vue.use(api);

export default {
  name: 'achievePeradjustment',
  props: ['perAchieveAdjustmentVisible', 'multipleSelectionPer'],
  data() {
    return {
      copyPerAchieveAdjustmentVisible: this.perAchieveAdjustmentVisible,
      radio: '',
      perTransactionCaseArr: [],
    };
  },
  watch: {
    perAchieveAdjustmentVisible(newVal) {
      this.copyPerAchieveAdjustmentVisible = newVal;
    },
  },
  methods: {
    handleClose() {
      this.$emit('closePerAchieveDialog', false);
    },
    getPerTransactionCase() {
      // TODO:正式环境更改,一下围测试环境下
      const customerType = this.multipleSelectionPer[0].customerType;
      const PersonnelID = this.multipleSelectionPer[0].broker;
      const achievePeradjustmentMonth = news.injectYearAndMonth().Month >= 10 ? news.injectYearAndMonth().Month.toString() : '0' + news.injectYearAndMonth().Month;
      console.log({
        OrganizationID: this.$store.state.comData.commonData.OrganizeId,
        years: new Date().getFullYear() + achievePeradjustmentMonth,
        customerType,
        RequestType: 1,
        PersonnelID,
      });
      this.$api.monthScheduleTable({
        OrganizationID: this.$store.state.comData.commonData.OrganizeId,
        years: new Date().getFullYear() + achievePeradjustmentMonth,
        customerType,
        RequestType: 1,
        PersonnelID,
      })
        .then((res) => {
          this.perTransactionCaseArr = [];
          console.log(JSON.parse(res.data));
          if (JSON.parse(res.data).length > 0) {
            JSON.parse(res.data).forEach((el) => {
              const obj = {};
              obj.CaseName = el.CaseName;
              obj.value = el.value;
              obj.CustomerID = el.CustomerID;
              obj.CustomerType = el.CustomerType;
              obj.CustomerName = el.CustomerName;
              obj.ID = el.ID;
              this.perTransactionCaseArr.push(obj);
            });
          }
          if (this.perTransactionCaseArr.length > 0) {
            this.radio = this.perTransactionCaseArr[0].ID;
          }
        })
        .catch((errMsg) => {
          console.log(errMsg);
        });
    },
    perTransactionCaseSubmit() {
      let i;
      this.copyPerAchieveAdjustmentVisible = false;
      if (this.perTransactionCaseArr.length > 0) {
        this.perTransactionCaseArr.forEach((el, index) => {
          if (el.ID === this.radio) {
            i = index;
            return '';
          }
          return '';
        });
        const params = {};
        params.CaseName = this.perTransactionCaseArr[i].CaseName;
        params.CustomerID = this.perTransactionCaseArr[i].CustomerID;
        params.CustomerName = this.perTransactionCaseArr[i].CustomerName;
        if (this.multipleSelectionPer.length === 1) {
          params.ID = this.multipleSelectionPer[0].ID;
        }
        params.RequestType = 1;
        console.log(params);
        this.$api.monthTransactionCase(params)
          .then((res) => {
            console.log(res);
            window.location.reload();
          })
          .catch((errMsg) => {
            console.log(errMsg);
          });
      }
    },
  },
};
</script>

<style scoped>

</style>
<style lang="less">
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
        .el-radio:last-child{
          margin-top: 10px;
        }
      }
      .note{
        .red{
          color: red;
          vertical-align: middle;
        }
      }
    }
    .el-dialog__body{
      padding-top: 10px;
    }
  }
</style>
