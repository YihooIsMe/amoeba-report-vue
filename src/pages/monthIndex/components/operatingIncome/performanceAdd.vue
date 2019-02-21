<template>
    <div id="performance-add">
      <el-dialog
        title="业绩收入 - 预定"
        center
        :visible.sync="copyDialogPerformance"
        width="600px"
        top="5vh"
        custom-class="performance-dialog"
        @close="doClose"
      >
        <el-form ref="performanceAddForm" :model="performanceAddForm" :rules="rules" label-width="120px">
          <el-form-item label="经纪人" prop="broker">
            <el-row :gutter="20">
              <el-col :span="11">
                <el-select ref="broker" v-model="performanceAddForm.broker" placeholder="请选择经纪人" size="small" @change="selectBrokerLabel">
                  <el-option v-for="(item, i) in getStoreBrokerData" :key="i" :label="item.F_RealName" :value="item.F_Id"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="客户类型">
           <el-row :gutter="20">
             <el-col :span="11">
               <el-select v-model="performanceAddForm.saleAndLease" placeholder="请选择类型" size="small">
                 <el-option label="买卖" :value="1"></el-option>
                 <el-option label="租赁" :value="2"></el-option>
               </el-select>
             </el-col>
             <el-col :span="11">
               <el-select v-model="performanceAddForm.customerType" placeholder="请选择客户类型" size="small" @change="selectCustomerType">
                 <el-option label="业主方" :value="1"></el-option>
                 <el-option label="买方" :value="2"></el-option>
               </el-select>
             </el-col>
           </el-row>
          </el-form-item>
          <div v-if="performanceAddForm.customerType === 1">
            <el-form-item label="案件名称">
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item prop="objectNum" class="objectNum" ref="objectNumForm">
                    <el-input v-model="performanceAddForm.objectNum" @blur="getQueryInfo" ref="objectNum" placeholder="请输入物件编号" size="small" :clearable="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <i class="el-icon-search" @click="getQueryInfo"></i>
                </el-col>
                <el-col :span="7">
                  {{performanceAddForm.caseName}}
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="客户">
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item prop="customer" class="customerName" ref="customerForm">
                    <el-input v-model="performanceAddForm.customer" :disabled="true" size="small" :clearable="true"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="客户">
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item prop="searchCustomer" class="searchCustomer" ref="searchCustomerForm">
                    <el-input v-model.number="performanceAddForm.searchCustomer" @blur="getQueryInfo" ref="searchCustomer" placeholder="请输入客户手机号" size="small" :clearable="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <i class="el-icon-search" @click="getQueryInfo"></i>
                </el-col>
                <el-col :span="9">
                  <el-form-item prop="searchCustomerName" class="searchCustomerName">
                    <el-input v-model="performanceAddForm.searchCustomerName" :disabled="true" placeholder="查询获取客户姓名"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="需求内容">
              <el-row :gutter="20">
                <el-col :span="22">
                  <el-form-item prop="demandContent" class="demandContent" ref="demandContentForm">
                    <el-input type="textarea" :rows="2" placeholder="20字以内" v-model="performanceAddForm.demandContent" resize="none" maxlength="30"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <el-form-item label="目前情况" prop="currentSituation">
            <el-row :gutter="20">
              <el-col :span="11">
                <el-select v-model="performanceAddForm.currentSituation" placeholder="请选择目前情况" size="small">
                  <el-option v-for="n in 7" :key="n" :label="`S${n}`" :value="`S${n}`"></el-option>
                  <el-option v-for="n in 7" :key="n+7" :label="`D${n}`" :value="`D${n}`"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="达成可能性" prop="completedPercent">
            <el-row :gutter="20">
              <el-col :span="11">
                <el-input size="small" v-model="performanceAddForm.completedPercent"></el-input>
              </el-col>
              <el-col :span="11">%</el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="本月收回业绩" prop="recoveryPerformance">
            <el-row :gutter="20">
              <el-col :span="11">
                <el-input v-model.number="performanceAddForm.recoveryPerformance" size="small" :clearable="true"></el-input>
              </el-col>
              <el-col :span="11">元</el-col>
            </el-row>
          </el-form-item>
          <div class="submit-btn">
            <el-button type="warning" @click="onSubmit('performanceAddForm')">确认</el-button>
            <el-button @click="copyDialogPerformance = false">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import { Message } from 'element-ui';
import api from '@/http/index';
import news from '@/assets/js/notification';

Vue.use(api);

export default {
  name: 'performanceAdd',
  props: ['getStoreBrokerData', 'dialogPerformance'],
  data() {
    const checkCompletedPercent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入达成可能性'));
      } else if (!/^(\d{1,2}|100)$/.test(value)) {
        callback(new Error('请输入0-100的整数'));
      }
      callback();
    };
    return {
      copyDialogPerformance: this.dialogPerformance,
      performanceAddForm: {
        broker: '',
        saleAndLease: 1,
        customerType: 1,
        // objectNum: 'SAJ00261787',
        objectNum: '',
        caseName: '',
        customer: '',
        customerID: '',
        // searchCustomer: 8602165120564,
        searchCustomer: '',
        searchCustomerName: '',
        demandContent: '',
        currentSituation: '',
        completedPercent: '',
        recoveryPerformance: '',
        brokerLabel: '',
      },
      rules: {
        broker: [
          { required: true, message: '请选择经纪人', trigger: 'change' },
        ],
        saleAndLease: [
          { required: true, message: '请选择经纪人', trigger: 'change' },
        ],
        customerType: [
          { required: true, message: '请选择经纪人', trigger: 'change' },
        ],
        currentSituation: [
          { required: true, message: '请选择目前情况', trigger: 'change' },
        ],
        completedPercent: [
          { validator: checkCompletedPercent, trigger: 'blur' },
          // { required: true, message: '请输入达成可能性', trigger: 'blur' },
          // { type: 'number', message: '请输入数字', trigger: 'blur' },
        ],
        recoveryPerformance: [
          { required: true, message: '请输入本月收回业绩', trigger: 'blur' },
          { type: 'number', message: '收回业绩必须为数字值', trigger: 'blur' },
        ],
        objectNum: [
          { required: true, message: '请输入物件编号' },
        ],
        customer: [
          { required: true, message: '请根据物件编号查询客户相关信息' },
        ],
        demandContent: [
          { required: true, message: '请填写需求内容' },
        ],
        searchCustomer: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { type: 'number', message: '手机号必须为数字值', trigger: 'blur' },
        ],
        searchCustomerName: [
          { required: true, message: '请根据手机号查询客户信息' },
        ],
      },
    };
  },
  methods: {
    selectBrokerLabel(val) {
      this.getStoreBrokerData.forEach((item, i) => {
        const brokerObj = {};
        if (item.F_Id === val) {
          brokerObj.label = this.getStoreBrokerData[i].F_RealName;
          this.performanceAddForm.brokerLabel = brokerObj.label;
        }
      });
      console.log(this.performanceAddForm.brokerLabel);
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('givePerFormDate', this.performanceAddForm);
          this.copyDialogPerformance = false;
          this.$refs[formName].resetFields();
          this.performanceAddForm.caseName = '';
        } else {
          console.log('error submit!');
        }
      });
    },
    selectCustomerType() {
      if (this.performanceAddForm.customerType === 1) {
        this.$refs.searchCustomerForm.clearValidate();
        this.$refs.demandContentForm.clearValidate();
      } else {
        this.$refs.objectNumForm.clearValidate();
        this.$refs.customerForm.clearValidate();
      }
    },
    doClose() {
      this.$emit('changePerformanceDialog', false);
    },
    messageInfo(msg) {
      Message({
        message: msg,
        duration: 1000,
        type: 'warning',
      });
    },
    getQueryInfo() {
      if (this.performanceAddForm.broker === '') {
        this.messageInfo('请选择经纪人');
        this.$refs.broker.focus();
        return false;
      }
      if (this.performanceAddForm.customerType === 1 && this.performanceAddForm.objectNum === '') {
        this.messageInfo('请输入物件编号');
        // this.$refs.objectNum.focus();
        return false;
      }
      if (this.performanceAddForm.customerType === 2 && this.performanceAddForm.searchCustomer === '') {
        this.messageInfo('请输入客户手机号');
        // this.$refs.searchCustomer.focus();
        return false;
      }
      const queryParams = {};
      queryParams.OwnerID = this.performanceAddForm.broker;
      queryParams.CustomerType = this.performanceAddForm.customerType;
      if (this.performanceAddForm.customerType === 1) {
        queryParams.ObjectNo = this.performanceAddForm.objectNum;
      } else {
        queryParams.Phone = this.performanceAddForm.searchCustomer;
      }
      this.$api.monthOperatingAdd(queryParams)
        .then((res) => {
          if (this.performanceAddForm.customerType === 1) {
            if (JSON.parse(res.data).length === 0) {
              this.messageInfo('查询无结果,请确认物件编号正确');
              // this.$refs.objectNum.focus();
              this.performanceAddForm.customer = '';
              this.performanceAddForm.caseName = '';
              return false;
            }
            this.performanceAddForm.customer = JSON.parse(res.data)[0].Name + ' ' + JSON.parse(res.data)[0].PhoneNumber;
            this.performanceAddForm.caseName = JSON.parse(res.data)[0].CaseName;
            console.log(JSON.parse(res.data));
          } else {
            if (JSON.parse(res.data).length === 0) {
              this.messageInfo('查询无结果,请确认手机号码正确');
              // this.$refs.searchCustomer.focus();
              this.performanceAddForm.searchCustomerName = '';
              return false;
            }
            this.performanceAddForm.searchCustomerName = JSON.parse(res.data)[0].Name;
            console.log(JSON.parse(res.data));
          }
          this.performanceAddForm.customerID = JSON.parse(res.data)[0].ID;
          return '';
        })
        .catch((err) => {
          console.log(err);
          news.ElErrorMessage(err);
        });
      return '';
    },
  },
  watch: {
    dialogPerformance(newVal) {
      this.copyDialogPerformance = newVal;
    },
  },
};
</script>

<style scoped>
.el-icon-search{
  color:red;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
</style>
<style lang="less">
  #performance-add{
    input[readonly]{
      background-color: white;
    }
    .submit-btn{
      text-align: center;
      margin-top: 10px;
    }
    .el-dialog--center .el-dialog__body{
      padding-top: 0;
    }
    .el-dialog__header{
      background-color: #409EFF;
      margin-bottom: 10px;
      padding-top: 15px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      span{
        color:white;
      }
      i:before{
        color:white;
      }
    }
    .el-dialog__headerbtn{
      top:15px;
    }
    .el-dialog__body{
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    .performance-dialog{
      -webkit-border-radius: 5px !important;
      -moz-border-radius: 5px !important;
      border-radius: 5px !important;
    }
    .el-form-item__error{
      left:10px;
    }
    .objectNum,.customerName,.searchCustomer,.demandContent,.searchCustomerName{
      .el-form-item__error{
        left: 0;
      }
    }
  }
</style>
