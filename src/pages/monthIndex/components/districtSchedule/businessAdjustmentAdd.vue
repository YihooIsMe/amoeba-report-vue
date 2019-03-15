<template>
  <div class="businessAdjustmentAdd">
    <el-dialog
      class="signingFeeAddDialog"
      width="600px"
      title="业绩调整新增"
      :visible.sync="dialogFormVisible"
      center
      @close="doClose">
      <el-form :model="businessAdjustmentForm" ref="businessAdjustmentForm" :rules="rules">
        <el-form-item label="客户名/案名" :label-width="formLabelWidth" prop="Name">
          <el-input v-model="businessAdjustmentForm.Name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="店名" :label-width="formLabelWidth" prop="OrganizeName_A">
          <el-select v-model="businessAdjustmentForm.OrganizeName_A" placeholder="请选择店名">
            <el-option
              :label="item.F_FullName"
              :value="item.F_FullName"
              v-for="item in storeList"
              :key="item.F_Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定金额" :label-width="formLabelWidth" prop="YDAmount_A">
          <el-input v-model.number="businessAdjustmentForm.YDAmount_A" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="店名" :label-width="formLabelWidth" prop="OrganizeName_B">
          <el-select v-model="businessAdjustmentForm.OrganizeName_B" placeholder="请选择店名">
            <el-option
              :label="item.F_FullName"
              :value="item.F_FullName"
              v-for="item in storeList"
              :key="item.F_Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预定金额" :label-width="formLabelWidth" prop="YDAmount_B">
          <el-input v-model.number="businessAdjustmentForm.YDAmount_B" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="调减业绩" :label-width="formLabelWidth" prop="AdjustmentAmount">
          <el-input v-model.number="businessAdjustmentForm.AdjustmentAmount" autocomplete="off" clearable></el-input>
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
import Vue from 'vue';

export default {
  name: 'businessAdjustmentAdd',
  props: ['dialogIsShow'],
  data() {
    return {
      dialogFormVisible: this.dialogIsShow,
      storeList: [],
      businessAdjustmentForm: {
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
          { required: true, message: '请输入调减业绩', trigger: 'blur' },
          { type: 'number', message: '调减业绩必须为数字值' },
        ],
      },
    };
  },
  methods: {
    doClose() {
      this.$emit('changeDialogShow', false);
      this.$refs.businessAdjustmentForm.resetFields();
      Vue.delete(this.businessAdjustmentForm, 'type');
      Vue.delete(this.businessAdjustmentForm, 'index');
    },
    doNewAdd() {
      Vue.set(this.businessAdjustmentForm, 'type', 'newAdd');
    },
    doModify(data) {
      this.$nextTick(() => {
        this.$refs.businessAdjustmentForm.resetFields();
        const arrayList = ['index', 'type', 'Name', 'OrganizeName_A', 'YDAmount_A', 'OrganizeName_B', 'YDAmount_B', 'AdjustmentAmount'];
        arrayList.forEach((el) => {
          Vue.set(this.businessAdjustmentForm, el, data[el]);
          // this.businessAdjustmentForm[el] = data[el];
        });
      });
    },
    businessAdjustmentSureForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // TODO:为什么console.log打印出来没有数据，但是父组件却拿到了数据？？？
          // 原因找到了：是因为在打印之后，会有清空表单这样一部操作，log里面的数据其实是有的，但是后面变没有了；
          console.log(this.businessAdjustmentForm);
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
