<template>
  <div class="businessAdjustmentAdd">
    <el-dialog
      class="signingFeeAddDialog"
      width="600px"
      title="签约金调整新增"
      :visible.sync="dialogFormVisible"
      center
      @close="doClose">
      <el-form :model="businessAdjustmentForm" ref="businessAdjustmentForm" :rules="rules">
        <el-form-item label="客户名/案名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="businessAdjustmentForm.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="店名" :label-width="formLabelWidth" prop="store">
          <el-select v-model="businessAdjustmentForm.store" placeholder="请选择店名">
            <el-option
              :label="item.F_FullName"
              :value="item.F_FullName"
              v-for="item in storeList"
              :key="item.F_Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定金额" :label-width="formLabelWidth" prop="bookAmount">
          <el-input v-model.number="businessAdjustmentForm.bookAmount" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="店名" :label-width="formLabelWidth" prop="storeOther">
          <el-select v-model="businessAdjustmentForm.storeOther" placeholder="请选择店名">
            <el-option
              :label="item.F_FullName"
              :value="item.F_FullName"
              v-for="item in storeList"
              :key="item.F_Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定金额" :label-width="formLabelWidth" prop="bookAmountOther">
          <el-input v-model.number="businessAdjustmentForm.bookAmountOther" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="调减业绩" :label-width="formLabelWidth" prop="reducePerformance">
          <el-input v-model.number="businessAdjustmentForm.reducePerformance" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="businessAdjustmentSureForm('businessAdjustmentForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'businessAdjustmentAdd',
  props: ['dialogIsShow'],
  data() {
    return {
      dialogFormVisible: this.dialogIsShow,
      storeList: [],
      businessAdjustmentForm: {
        name: '',
        store: '',
        bookAmount: '',
        storeOther: '',
        bookAmountOther: '',
        reducePerformance: '',
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
        reducePerformance: [
          { required: true, message: '请输入调减业绩', trigger: 'blur' },
          { type: 'number', message: '调减业绩必须为数字值' },
        ],
      },
    };
  },
  methods: {
    doClose() {
      this.$emit('changeDialogShow', false);
    },
    businessAdjustmentSureForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('setBusinessAdjustmentForm', this.businessAdjustmentForm);
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

<style scoped>

</style>
