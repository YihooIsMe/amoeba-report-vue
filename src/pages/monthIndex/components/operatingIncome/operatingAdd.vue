<template>
    <div id="operating-add">
      <el-dialog
        title="营业收入预定 - 新增"
        center
        :visible.sync="copyDialogTableVisible"
        width="550px"
        top="5vh"
        custom-class="operate-dialog"
        @close="doClose">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="经纪人">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-select v-model="form.region" placeholder="请选择经纪人" size="small">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="客户类型">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-select v-model="form.region1" placeholder="请选择活动区域" size="small">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-select v-model="form.region2" placeholder="请选择活动区域" size="small">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="已签立委托">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-radio-group v-model="form.resource">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="案件名称">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-input v-model="form.delivery" placeholder="请输入物件编号" size="small" :clearable="true"></el-input>
            </el-col>
            <el-col :span="2">
              <i class="el-icon-search"></i>
            </el-col>
            <el-col :span="8">
              徐家汇花园
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="客户">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-input v-model="form.type" :disabled="true" size="small" :clearable="true"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="目前情况">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-select v-model="form.resource" placeholder="请选择活动区域" size="small">
                <el-option label="D1" value="D1"></el-option>
                <el-option label="D2" value="D2"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="全佣签约金">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-input v-model="form.desc" size="small" :clearable="true"></el-input>
            </el-col>
            <el-col :span="10">元</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="折让中人类型">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-select v-model="form.resource" placeholder="请选择活动区域" size="small">
                <el-option label="D1" value="D1"></el-option>
                <el-option label="D2" value="D2"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="折让中人签约金">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-input v-model="form.desc" size="small" :clearable="true"></el-input>
            </el-col>
            <el-col :span="10">元</el-col>
          </el-row>
        </el-form-item>
        <div class="submit-btn" style="text-align: center">
          <el-button type="warning" @click="onSubmit">确认</el-button>
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
} from 'element-ui';

Vue.component(Select.name, Select);
Vue.use(Dialog);
Vue.use(Option);
Vue.use(Col);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Row);

export default {
  name: 'operatingAdd',
  props: {
    dialogTableVisible: Boolean,
  },
  data() {
    return {
      copyDialogTableVisible: this.dialogTableVisible,
      form: {
        name: '',
        region: '',
        region1: '',
        region2: '',
        date1: '',
        date2: '',
        delivery: '',
        type: '',
        resource: '',
        desc: '',
      },
    };
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    doClose() {
      this.$emit('changeDialogShow', false);
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
    margin-bottom: 0;
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
}
</style>
