<template>
  <div class="signingFeeAdd">
    <el-dialog
      class="signingFeeAddDialog"
      width="600px"
      title="签约金调整新增"
      :visible.sync="dialogFormVisible"
      center
      @close="doClose">
      <el-form :model="signingFeeAddForm" ref="signingFeeAddForm" :rules="rules">
        <el-form-item label="客户名/案名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="signingFeeAddForm.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="店名" :label-width="formLabelWidth" prop="store">
          <el-select v-model="signingFeeAddForm.store" placeholder="请选择店名">
            <el-option
              :label="item.F_FullName"
              :value="item.F_FullName"
              v-for="item in storeList"
              :key="item.F_Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定金额" :label-width="formLabelWidth" prop="bookAmount">
          <el-input v-model.number="signingFeeAddForm.bookAmount" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="店名" :label-width="formLabelWidth" prop="storeOther">
          <el-select v-model="signingFeeAddForm.storeOther" placeholder="请选择店名">
            <el-option
              :label="item.F_FullName"
              :value="item.F_FullName"
              v-for="item in storeList"
              :key="item.F_Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定金额" :label-width="formLabelWidth" prop="bookAmountOther">
          <el-input v-model.number="signingFeeAddForm.bookAmountOther" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="调整签约金" :label-width="formLabelWidth" prop="adjustmentContractMoney">
          <el-input v-model.number="signingFeeAddForm.adjustmentContractMoney" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="signingFeeSureForm('signingFeeAddForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'signingFeeAdjustmentAdd',
  props: ['dialogIsShow'],
  data() {
    return {
      dialogFormVisible: this.dialogIsShow,
      storeList: [],
      signingFeeAddForm: {
        name: '',
        store: '',
        bookAmount: '',
        storeOther: '',
        bookAmountOther: '',
        adjustmentContractMoney: '',
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请输入客户名或者案名', trigger: 'blur' },
        ],
        store: [
          { required: true, message: '请选择门店', trigger: 'change' },
        ],
        bookAmount: [
          { required: true, message: '请输入预定金额', trigger: 'blur' },
          { type: 'number', message: '预定金额必须为数字值' },
        ],
        storeOther: [
          { required: true, message: '请选择门店', trigger: 'change' },
        ],
        bookAmountOther: [
          { required: true, message: '请输入预定金额', trigger: 'blur' },
          { type: 'number', message: '预定金额必须为数字值' },
        ],
        adjustmentContractMoney: [
          { required: true, message: '请输入调整签约金', trigger: 'blur' },
          { type: 'number', message: '调整签约金必须为数字值' },
        ],
      },
    };
  },
  methods: {
    doClose() {
      this.$emit('changeDialogShow', false);
    },
    signingFeeSureForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.signingFeeAddForm);
          this.$emit('setSigningFeeAddForm', this.signingFeeAddForm);
          this.dialogFormVisible = false;
          this.$refs[formName].resetFields();
        }
      });
    },
  },
  computed: {
    districtScheduleState() {
      return this.$store.state.districtSchedule.storeList;
    },
  },
  watch: {
    dialogIsShow(newVal) {
      this.dialogFormVisible = newVal;
    },
    districtScheduleState(val) {
      this.storeList = val;
    },
  },
};
</script>

<style>
.signingFeeAddDialog .el-input{
  width: 300px;
}
.signingFeeAddDialog input[readonly]{
  background-color: white;
}
</style>
