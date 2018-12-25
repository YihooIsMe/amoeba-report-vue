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
        <el-radio v-model="radio" label="1">SAM111111</el-radio>
        <br>
        <el-radio v-model="radio" label="2">SAM2222222</el-radio>
      </div>
      <div class="note">
        <span class="red">*</span>只能调月预定案件，预定和实际的客户类别必须一致，同一案子同一客户类别只能匹配一条月预定记录
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="copyAchieveAdjustmentVisible = false">取 消</el-button>
    <el-button type="primary" @click="copyAchieveAdjustmentVisible = false">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue';
import { Radio } from 'element-ui';

Vue.use(Radio);

export default {
  name: 'achieveAdjustment',
  props: ['achieveAdjustmentVisible'],
  data() {
    return {
      copyAchieveAdjustmentVisible: this.achieveAdjustmentVisible,
      radio: '1',
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
      padding-left: 30px;
      margin-top: 20px;
      .el-radio:last-child{
        margin-top: 10px;
      }
    }
    .note{
      margin-top: 20px;
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
