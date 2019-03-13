<template>
    <div id="operating-add">
      <el-dialog
        title="营业收入预定 - 新增"
        center
        :visible.sync="copyDialogTableVisible"
        width="600px"
        top="5vh"
        custom-class="operate-dialog"
        @close="doClose">
      <el-form ref="AddForm" :model="AddForm" :rules="rules" label-width="120px">
        <el-form-item label="经纪人" prop="broker">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-select ref="broker" v-model="AddForm.broker" placeholder="请选择经纪人" size="small" @change="selectBrokerLabel">
                <el-option v-for="(item, index) in getStoreBrokerData" :key="index" :label="item.F_RealName" :value="item.F_Id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="客户类型">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-select v-model="AddForm.saleAndLease" placeholder="请选择类型" size="small">
                <el-option label="买卖" :value="1"></el-option>
                <el-option label="租赁" :value="2"></el-option>
              </el-select>
            </el-col>
            <el-col :span="11">
              <el-select v-model="AddForm.customerType" placeholder="请选择客户类型" size="small" @change="selectCustomerType">
                <el-option label="业主方" :value="1"></el-option>
                <el-option label="买方" :value="2"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <div v-if="AddForm.customerType === 1">
          <el-form-item label="案件名称">
            <el-row :gutter="20">
              <el-col :span="11">
                <el-form-item prop="objectNum" class="objectNum" ref="objectNumForm">
                  <el-input ref="objectNum" v-model="AddForm.objectNum" @blur="getQueryInfo" placeholder="请输入物件编号" size="small" :clearable="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <i class="el-icon-search" @click="getQueryInfo"></i>
              </el-col>
              <el-col :span="9">
                {{AddForm.caseName}}
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="客户">
            <el-row :gutter="20">
              <el-col :span="11">
                <el-form-item prop="customer" class="customerName" ref="customerForm">
                  <el-input v-model="AddForm.customer" :disabled="true" size="small" :clearable="true"></el-input>
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
                  <el-input v-model.number="AddForm.searchCustomer" ref="searchCustomer" @blur="getQueryInfo" placeholder="请输入客户手机号" size="small" :clearable="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <i class="el-icon-search" @click="getQueryInfo"></i>
              </el-col>
              <el-col :span="9">
                <el-form-item prop="searchCustomerName" class="searchCustomerName">
                  <el-input v-model="AddForm.searchCustomerName" :disabled="true" placeholder="查询获取客户姓名"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="需求内容">
            <el-row :gutter="20">
              <el-col :span="22">
                <el-form-item prop="demandContent" class="demandContent" ref="demandContentForm">
                  <el-input type="textarea" :rows="2" placeholder="20字以内" v-model="AddForm.demandContent" resize="none" maxlength="30"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <el-form-item label="目前情况" prop="currentSituation">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-select v-model="AddForm.currentSituation" placeholder="请选择目前情况" size="small">
                <el-option v-for="n in 7" :key="n" :label="`S${n}`" :value="`S${n}`"></el-option>
                <el-option v-for="n in 7" :key="n+7" :label="`D${n}`" :value="`D${n}`"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="达成可能性" prop="completedPercent">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-input size="small" v-model="AddForm.completedPercent"></el-input>
            </el-col>
            <el-col :span="11">%</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="全佣签约金" prop="fullCommissionSign">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-input v-model.number="AddForm.fullCommissionSign" size="small" :clearable="true"></el-input>
            </el-col>
            <el-col :span="11">元</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="折让中人类型" prop="discountType">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-select v-model="AddForm.discountType" placeholder="请选择折让中人类型" size="small">
                <el-option
                  v-for="(item, i) in discountTypeOption"
                  :label="item.label"
                  :value="item.label"
                  :key="i"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="折让中人签约金" prop="discountAmount">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-input v-model="AddForm.discountAmount" size="small" :clearable="true"></el-input>
            </el-col>
            <el-col :span="11">元</el-col>
          </el-row>
        </el-form-item>
        <div class="submit-btn">
          <el-button type="warning" @click="onSubmit('AddForm')">确认</el-button>
          <el-button @click="copyDialogTableVisible = false">取消</el-button>
        </div>
      </el-form>
      </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import {
  Dialog,
  Select,
  Option,
  Col,
  Row,
  Radio,
  RadioGroup,
  Input,
  Icon,
  Message,
} from 'element-ui';
import api from '@/http/index';
import news from '@/assets/js/notification';

Vue.component(Select.name, Select);
Vue.use(Dialog);
Vue.use(Option);
Vue.use(Col);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Row);
Vue.use(api);

export default {
  name: 'operatingAdd',
  props: {
    dialogTableVisible: Boolean,
    getStoreBrokerData: Array,
  },
  data() {
    const checkDiscountAmount = (rule, value, callback) => {
      if (value !== '') {
        console.log(value);
        if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value)) {
          callback(new Error('请输入有效数字'));
        }
        callback();
      }
      callback();
    };
    const checkCompletedPercent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入达成可能性'));
      } else if (!/^(\d{1,2}|100)$/.test(value)) {
        callback(new Error('请输入0-100的整数'));
      }
      callback();
    };
    return {
      copyDialogTableVisible: this.dialogTableVisible,
      brokerLabel: '',
      discountTypeOption: [
        { label: '买卖(业主方)' },
        { label: '买卖(买方)' },
        { label: '租赁(出租方)' },
        { label: '租赁(承租方)' },
        { label: '买卖(业主方中人)' },
        { label: '买卖(买方中人)' },
        { label: '租赁(出租方中人)' },
        { label: '租赁(承租方中人)' },
      ], // 折让中人类型
      AddForm: {
        type: '',
        id: '',
        broker: '',
        saleAndLease: 1,
        customerType: 1,
        // objectNum: 'SAJ00261787',
        objectNum: '',
        caseName: '',
        customer: '',
        customerID: '',
        // searchCustomer: 15088909556,
        searchCustomer: '',
        searchCustomerName: '',
        demandContent: '',
        currentSituation: '',
        completedPercent: '',
        fullCommissionSign: '',
        discountType: '',
        discountAmount: '',
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
          // { required: true, message: '请输入达成可能性', trigger: 'blur' },
          { validator: checkCompletedPercent, trigger: 'blur' },
        ],
        fullCommissionSign: [
          { required: true, message: '请输入全佣签约金', trigger: 'blur' },
          { type: 'number', message: '全佣签约金必须为数字值', trigger: 'blur' },
        ],
        discountType: [
          // { required: true, message: '请选择折让中人类型', trigger: 'change' },
        ],
        discountAmount: [
          // { required: true, message: '请输入折让中人金额', trigger: 'blur' },
          // { type: 'number', message: '折让中人金额必须为数字值', trigger: 'blur' },
          { validator: checkDiscountAmount, trigger: 'blur' },
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
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('giveFormDate', this.AddForm);
          this.copyDialogTableVisible = false;
          this.$refs[formName].resetFields();
          this.AddForm.caseName = '';
          this.AddForm.searchCustomerName = '';
        } else {
          console.log('error submit!');
        }
      });
    },
    doNewAdd() {
      Vue.set(this.AddForm, 'type', 'newAdd');
    },
    doModify(data) {
      console.log(data);
      // DOM加载完成后执行，否则获取不到this.$refs.AddForm元素，报错；
      this.$nextTick(() => {
        this.$refs.AddForm.resetFields();
        this.AddForm.caseName = '';
        this.AddForm.searchCustomerName = '';
        const arrList = ['type', 'broker', 'saleAndLease', 'customerType', 'objectNum', 'caseName', 'customer', 'searchCustomer', 'searchCustomerName', 'demandContent', 'currentSituation', 'completedPercent', 'fullCommissionSign', 'discountType', 'discountAmount', 'index'];
        arrList.forEach((el) => {
          this.AddForm[el] = data[el];
        });
      });
    },
    selectCustomerType() {
      if (this.AddForm.customerType === 1) {
        this.$refs.searchCustomerForm.clearValidate();
        this.$refs.demandContentForm.clearValidate();
      } else {
        this.$refs.objectNumForm.clearValidate();
        this.$refs.customerForm.clearValidate();
      }
    },
    selectBrokerLabel(val) {
      this.getStoreBrokerData.forEach((item, i) => {
        const brokerObj = {};
        if (item.F_Id === val) {
          brokerObj.label = this.getStoreBrokerData[i].F_RealName;
          this.AddForm.brokerLabel = brokerObj.label;
        }
      });
    },
    doClose() {
      this.$emit('changeDialogShow', false);
      this.$refs.AddForm.resetFields();
      this.AddForm.caseName = '';
      this.AddForm.searchCustomerName = '';
    },
    messageInfo(msg) {
      Message({
        message: msg,
        duration: 1000,
        type: 'warning',
      });
    },
    getQueryInfo() {
      if (this.AddForm.broker === '') {
        this.messageInfo('请选择经纪人');
        this.$refs.broker.focus();
        return false;
      }
      if (this.AddForm.customerType === 1 && this.AddForm.objectNum === '') {
        this.messageInfo('请输入物件编号');
        // this.$refs.objectNum.focus();
        return false;
      }
      if (this.AddForm.customerType === 2 && this.AddForm.searchCustomer === '') {
        this.messageInfo('请输入客户手机号');
        // this.$refs.searchCustomer.focus();
        return false;
      }
      const queryParams = {};
      queryParams.OwnerID = this.AddForm.broker;
      queryParams.CustomerType = this.AddForm.customerType;
      if (this.AddForm.customerType === 1) {
        queryParams.ObjectNo = this.AddForm.objectNum;
      } else {
        queryParams.Phone = this.AddForm.searchCustomer;
      }
      this.$api.monthOperatingAdd(queryParams)
        .then((res) => {
          console.log(JSON.parse(res.data));
          console.log(JSON.parse(res.data).length);
          if (this.AddForm.customerType === 1) {
            if (JSON.parse(res.data).length === 0) {
              this.messageInfo('查询无结果,请确认物件编号正确');
              // this.$refs.objectNum.focus();
              this.AddForm.customer = '';
              this.AddForm.caseName = '';
              return false;
            }
            this.AddForm.customer = JSON.parse(res.data)[0].Name + ' ' + JSON.parse(res.data)[0].PhoneNumber;
            this.AddForm.caseName = JSON.parse(res.data)[0].CaseName;
            console.log(JSON.parse(res.data));
          } else {
            if (JSON.parse(res.data).length === 0) {
              this.messageInfo('查询无结果,请确认手机号码正确');
              // this.$refs.searchCustomer.focus();
              this.AddForm.searchCustomerName = '';
              return false;
            }
            this.AddForm.searchCustomerName = JSON.parse(res.data)[0].Name;
            console.log(JSON.parse(res.data));
          }
          this.AddForm.customerID = JSON.parse(res.data)[0].ID;
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
    dialogTableVisible(newVal) {
      this.copyDialogTableVisible = newVal;
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
#operating-add{
  input[readonly]{
    background-color: white;
  }
  .submit-btn{
    text-align: center;
    margin-top: 10px;
  }
  .el-form-item{
    /*margin-bottom: 0;*/
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
  .operate-dialog{
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
