<template>
  <div class="operating-income">
    营业收入（白色为预定，灰色为实际）
    <div class="child-operating-income">
      <el-button type="primary" plain size="small" @click="dialogTableVisible = true">新增</el-button>
      <el-button type="success" plain size="small" @click="deleteSelected">删除</el-button>
      <el-button type="warning" plain size="small" @click="achieveAdjustmentVisible = true">达成匹配调整</el-button>
      <el-table
        ref="multipleTable"
        :data="addFormArr"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="预定别"
          prop="bookType">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          label="经纪人" prop="broker">
        </el-table-column>
        <el-table-column
          label="种类"
          width="100">
          <template slot-scope="scope">
            <span v-html="scope.row.customerTypeSpl"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="客户姓名"
          width="120">
          <template slot-scope="scope">
            <span v-html="scope.row.customerNameSpl"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="案件名称/需求简介"
          width="120">
          <template slot-scope="scope">
            <span v-html="scope.row.objectNameDes"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="目前情况"
          prop="currentSituation">
        </el-table-column>
        <el-table-column
          label="达成可能性"
          prop="completedPercent">
        </el-table-column>
        <el-table-column
          label="全佣签约金预定"
          prop="fullCommissionSign">
        </el-table-column>
        <el-table-column
          label="全佣签约金实际"
          prop="fullCommissionSignActual">
        </el-table-column>
        <el-table-column
          label="全佣签约金预定实际差额"
          prop="fullCommissionSignDiff">
        </el-table-column>
        <el-table-column
          label="折让中人"
          prop="discountType">
        </el-table-column>
        <el-table-column
          label="折让中人金额预定"
          prop="discountAmount">
        </el-table-column>
        <el-table-column
          label="折让中人金额实际"
          prop="discountAmountActual">
        </el-table-column>
        <el-table-column
          label="折让中人预定实际差异"
          prop="discountAmountDiff">
        </el-table-column>
        <el-table-column
          label="预估签约金"
          prop="estimatedContractMoney">
        </el-table-column>
        <el-table-column
          label="实际签约金"
          prop="relContractMoney">
        </el-table-column>
        <el-table-column
          label="签约金预定实际差异"
          prop="ContractMoneyDiff">
        </el-table-column>
      </el-table>
    </div>
    <div class="performance-title">业绩收入（白色为预定，灰色为实际）</div>
    <div class="child-performance-income">
      <el-button type="primary" plain size="small" @click="dialogPerformance = true">新增</el-button>
      <el-button type="success" plain size="small">删除</el-button>
      <el-button type="warning" plain size="small">达成匹配调整</el-button>
      <el-table
        ref="multipleTable"
        :data="addPerformanceArr"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="预定别"
          prop="bookType"
          width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120">
        </el-table-column>
        <el-table-column
          label="经纪人" prop="broker">
        </el-table-column>
        <el-table-column
          label="种类" prop="customerType">
        </el-table-column>
        <el-table-column
          label="客户姓名"
          prop="customerName">
        </el-table-column>
        <el-table-column
          label="案件名称/需求简介"
          prop="objectNameDes">
        </el-table-column>
        <el-table-column
          label="目前情况"
          prop="currentSituation">
        </el-table-column>
        <el-table-column
          label="达成可能性"
          prop="completedPercent">
        </el-table-column>
        <el-table-column
          label="本月收回业绩(预定)"
          prop="fullCommissionSign">
        </el-table-column>
        <el-table-column
          label="本月收回业绩(实际)"
          prop="discountType">
        </el-table-column>
        <el-table-column
          label="全佣业绩预定实际差额"
          prop="discountAmount">
        </el-table-column>
      </el-table>
    </div>
    <OperatingAdd
      :dialogTableVisible="dialogTableVisible"
      :getStoreBrokerData="getStoreBrokerData"
      @changeDialogShow="getDialogShow"
      @giveFormDate="getAddFormData"></OperatingAdd>
    <AchieveAdjustment
      :achieveAdjustmentVisible="achieveAdjustmentVisible"
      @closeAchieveDialog="getAchieveDialog"></AchieveAdjustment>
    <PerformanceAdd
      :dialogPerformance="dialogPerformance"
      :getStoreBrokerData="getStoreBrokerData"
      @changePerformanceDialog="getPerformanceShow"
      @giveFormDate=""></PerformanceAdd>
  </div>
</template>

<script>
import OperatingAdd from './operatingAdd.vue';
import AchieveAdjustment from './achieveAdjustment.vue';
import PerformanceAdd from './performanceAdd.vue';

export default {
  name: 'operatingIncome',
  components: { PerformanceAdd, AchieveAdjustment, OperatingAdd },
  data() {
    return {
      addFormArr: [],
      addPerformanceArr: [],
      dialogTableVisible: false,
      dialogPerformance: false,
      achieveAdjustmentVisible: false,
      multipleSelection: [],
      selectIndexArray: [],
      getStoreBrokerData: [],
    };
  },
  methods: {
    getROwIndex(row) {
      return this.addFormArr.lastIndexOf(row);
    },
    handleSelectionChange(val) {
      this.selectIndexArray = [];
      console.log(val);
      this.multipleSelection = val;
      const self = this;
      val.map((el) => {
        const selectRowIndex = self.getROwIndex(el);
        if (selectRowIndex !== -1) {
          self.selectIndexArray.push(selectRowIndex);
        }
        return '';
      });
    },
    deleteSelected() {
      const copyAddFormArr = this.addFormArr.concat();
      // 特别注意此处的逻辑,删除array的数据后要自动往前挪一步;
      for (let i = 0; i < this.selectIndexArray.length; i += 1) {
        if (i === 0) {
          copyAddFormArr.splice(this.selectIndexArray[i], 1);
        } else {
          copyAddFormArr.splice(this.selectIndexArray[i] - 1, 1);
        }
      }
      console.log(copyAddFormArr);
      this.addFormArr = copyAddFormArr;
    },
    getDialogShow(newVal) {
      this.dialogTableVisible = newVal;
    },
    getPerformanceShow(newVal) {
      this.dialogPerformance = newVal;
    },
    getAchieveDialog(newVal) {
      this.achieveAdjustmentVisible = newVal;
    },
    getPerformData(newVal) {
      const formArrObj = {};
      formArrObj.bookType = '月预订';
      formArrObj.status = '达成'; // TODO:后面数据库传入数据;
      formArrObj.broker = newVal.brokerLabel;
      formArrObj.saleAndLease = newVal.saleAndLease;
      formArrObj.customerType = newVal.customerType;
      formArrObj.customerTypeSpl = (newVal.saleAndLease === '1' ? '买卖' : '租赁') + '(' + (newVal.customerType === '1' ? '业主方' : '买方') + ')';
      formArrObj.customerNameSpl = newVal.customer.split(' ')[0] + '<br>' + newVal.customer.split(' ')[1];
      formArrObj.customerName = newVal.customer.split(' ')[0];
      formArrObj.customerPhone = newVal.customer.split(' ')[1];
      formArrObj.objectNameDes = newVal.objectNum + '<br>' + newVal.caseName;
      formArrObj.objectNum = newVal.objectNum;
      formArrObj.caseName = newVal.caseName;
      formArrObj.currentSituation = newVal.currentSituation;
      formArrObj.completedPercent = '70%'; // TODO:暂时先写死;
      formArrObj.recoveryPerformance = '';
    },
    getAddFormData(newVal) {
      const formArrObj = {};
      formArrObj.bookType = '月预订';
      formArrObj.status = '达成'; // TODO:后面数据库传入数据;
      formArrObj.broker = newVal.brokerLabel;
      formArrObj.saleAndLease = newVal.saleAndLease;
      formArrObj.customerType = newVal.customerType;
      formArrObj.customerTypeSpl = (newVal.saleAndLease === '1' ? '买卖' : '租赁') + '(' + (newVal.customerType === '1' ? '业主方' : '买方') + ')';
      formArrObj.customerNameSpl = newVal.customer.split(' ')[0] + '<br>' + newVal.customer.split(' ')[1];
      formArrObj.customerName = newVal.customer.split(' ')[0];
      formArrObj.customerPhone = newVal.customer.split(' ')[1];
      formArrObj.objectNameDes = newVal.objectNum + '<br>' + newVal.caseName;
      formArrObj.objectNum = newVal.objectNum;
      formArrObj.caseName = newVal.caseName;
      formArrObj.currentSituation = newVal.currentSituation;
      formArrObj.completedPercent = '70%'; // TODO:暂时先写死;
      formArrObj.fullCommissionSign = newVal.fullCommissionSign;
      formArrObj.discountType = newVal.discountType;
      formArrObj.discountAmount = newVal.discountAmount;
      formArrObj.discountRelAmount = '100000'; // TODO:暂时先写死;
      console.log(formArrObj);
      this.addFormArr.push(formArrObj);
    },
    getStoreBroker() {
      this.$api.queryAndAddedUserInfo({ OrganizeID: '{0072F63D-741C-4DED-865A-F75BA73954A8}' })
        .then((res) => {
          this.getStoreBrokerData = JSON.parse(res.data);
          console.log(JSON.parse(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getStoreBroker();
  },
};
</script>

<style scoped>

.operating-income {
  padding: 5px;
}
.performance-title{
  margin-top: 20px;
}
.child-operating-income,.child-performance-income{
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
</style>
