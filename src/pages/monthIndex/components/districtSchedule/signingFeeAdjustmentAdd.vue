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
        <el-form-item label="客户名/案名" :label-width="formLabelWidth" prop="Name">
          <el-input v-model="signingFeeAddForm.Name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="店名" :label-width="formLabelWidth" prop="OrganizeName_A">
          <el-select v-model="signingFeeAddForm.OrganizeName_A" placeholder="请选择店名">
            <el-option
              :label="item.F_FullName"
              :value="item.F_FullName"
              v-for="item in storeList"
              :key="item.F_Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定金额" :label-width="formLabelWidth" prop="YDAmount_A">
          <el-input v-model.number="signingFeeAddForm.YDAmount_A" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="店名" :label-width="formLabelWidth" prop="OrganizeName_B">
          <el-select v-model="signingFeeAddForm.OrganizeName_B" placeholder="请选择店名">
            <el-option
              :label="item.F_FullName"
              :value="item.F_FullName"
              v-for="item in storeList"
              :key="item.F_Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定金额" :label-width="formLabelWidth" prop="YDAmount_B">
          <el-input v-model.number="signingFeeAddForm.YDAmount_B" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="调整签约金" :label-width="formLabelWidth" prop="AdjustmentAmount">
          <el-input v-model.number="signingFeeAddForm.AdjustmentAmount" autocomplete="off" clearable></el-input>
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
        Name: '',
        OrganizeName_A: '',
        YDAmount_A: '',
        OrganizeName_B: '',
        YDAmount_B: '',
        AdjustmentAmount: '',
      },
      formLabelWidth: '120px',
      rules: {
        Name: [
          { required: true, message: '请输入客户名或者案名', trigger: 'blur' },
        ],
        OrganizeName_A: [
          { required: true, message: '请选择门店', trigger: 'change' },
        ],
        YDAmount_A: [
          { required: true, message: '请输入预定金额', trigger: 'blur' },
          { type: 'number', message: '预定金额必须为数字值' },
        ],
        OrganizeName_B: [
          { required: true, message: '请选择门店', trigger: 'change' },
        ],
        YDAmount_B: [
          { required: true, message: '请输入预定金额', trigger: 'blur' },
          { type: 'number', message: '预定金额必须为数字值' },
        ],
        AdjustmentAmount: [
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
