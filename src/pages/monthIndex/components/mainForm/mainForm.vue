<template>
  <div class="main-form">
    <div class="main-form-btn">
      <el-button type="primary" plain size="small">隐藏所有细项</el-button>
      <div class="red mt10">说明：白色为输入，蓝色数据编辑【附表】【营业收入】后自动计算。当月实际，次月财务做账后会有数据。本表单主管审核后数据锁定。</div>
    </div>
    <div v-for="(tableData, index) in tableDataInject"
         :key="index"
         class="repeat-table-container">
      <div v-if="tableData.length>0">
        <table class="KMTable1 commonTable" border="1">
          <thead>
          <tr>
            <th>科目</th>
            <th>11月实际</th>
            <th>12月预定</th>
            <th>12月实际</th>
            <th>预定比(%)</th>
            <th>12月预定实际差异</th>
            <th>MP</th>
            <th>MP比</th>
            <th>累计MP</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in tableData"
              :key="i"
              :class="getForClassName(item.className)">
            <td>{{item.Name}}</td>
            <td v-for="n in 8" :key="n">
              <input type="text"
                     :readonly="item.ReadOnly === 1?true:false"
                     v-on="n === 2 && item.ReadOnly === 0 ? { focus : ($event) => inputFocus(item.className, $event), blur : ($event) => addSep($event)} : {}"
                     @keyup="handleInputNum"
                     @change="AutomaticCalculation(3, item.className, $event)"
              >
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <transition name="fade">
      <ManagementAlert :alertIndex="alertIndex"
                       :SigningRatio="SigningRatio"
                       :applyWhere="applyWhere"
                       v-show="isAlertShow"
                       @changeAlertShow="changeShow"
                       @giveSelectedNum="getSigningRatio">
      </ManagementAlert>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import ManagementAlert from '../../../../components/managementAlert.vue';
import cal from '../../../../assets/comCalculation';

export default {
  name: 'mainForm',
  components: { ManagementAlert },
  data() {
    return {
      getUrl: 'http://10.100.250.153:99/api/Subject',
      userID: '{85811A95-BB15-4914-8926-82E88F5E6E78}',
      responseData: {},
      tableSource: [],
      tableDataSource0: [], // Type类型为0的数据;
      tableDataSource1: [], // Type类型为1的数据;
      tableDataSource2: [], // Type类型为2的数据;
      tableDataSource3: [], // Type类型为3的数据;
      tableDataSource4: [], // Type类型为4的数据;
      tableDataSource5: [], // Type类型为5的数据;
      tableDataSource6: [], // Type类型为6的数据;
      tableDataSource7: [], // Type类型为7的数据;
      tableDataInject: [],
      rowSort: ['preMonthActual', 'currentMonthBooking', 'currentMonthActual', 'predeterminedRatio', 'scheduledActualDiff', 'MP', 'MPRatio', 'sumMP'],
      alertIndex: null,
      SigningRatio: 0.1,
      isAlertShow: false,
      applyWhere: 'monthIndex',
    };
  },
  methods: {
    getForClassName(el) {
      return el;
    },
    changeShow() {
      this.isAlertShow = false;
    },
    getSigningRatio(val) {
      this.SigningRatio = val;
      this.isAlertShow = false;
      this.AutomaticCalculation(3, 'F1', '');
      // this.AutomaticCalculation(this.alertIndex, 'F1', '');
    },
    inputFocus(className, event) {
      const currentEl = event.target;
      if (className === 'F1') {
        this.isAlertShow = true;
      } else {
        if (currentEl.value !== '') {
          currentEl.value = cal.remSep(currentEl.value);
        }
      }
    },
    addSep(event) {
      cal.calAddSep(event);
    },
    handleInputNum(e) {
      cal.calHandleInputNum(e);
    },
    dataInjection(data) {
      data.forEach((el) => {
        const elInput = document.querySelectorAll('table.commonTable tr.' + el.className + ' input');
        elInput[0].value = el.Amount;
        elInput[2].value = el.TheMonthAmount;
        elInput[3].value = el.PredeterminedRatio;
        elInput[4].value = el.Difference;
        elInput[5].value = el.AnnualReservation;
        elInput[6].value = el.MPRatio;
        elInput[7].value = el.GrandTotalMP;
      });
    },
    firstLoadingRequest() {
      axios.get(this.getUrl, {
        params: {
          userID: this.userID,
          IsYM: 1,
          Year: 2018,
          Month: 1,
        },
      }).then((res) => {
        console.log(JSON.parse(res.data));
        this.responseData = JSON.parse(res.data);
        this.$emit('giveStore', this.responseData.UnitName);
        this.tableSource = JSON.parse(res.data).list;
        this.injectTableSourceData();
        for (let i = 0; i < 8; i += 1) {
          this.tableDataInject.push(this['tableDataSource' + i]);
        }
        this.$nextTick(() => {
          this.dataInjection(this.tableSource);
        });
      }).catch((errMsg) => {
        console.log(errMsg);
      });
    },
    injectTableSourceData() {
      this.tableSource.forEach((item) => {
        this.getTypeObj(this['tableDataSource' + item.Type], item);
      });
    },
    getTypeObj(tableDataSource, data) {
      const obj = {
        ReadOnly: data.ReadOnly,
        Name: data.Name,
        className: data.className,
      };
      tableDataSource.push(obj);
    },
    currentMonthAutomaticCalculation(index) {
      cal.allTableCalculation(index);
    },
    calculatePredeterminedRatio() {
      this.tableSource.forEach((el) => {
        console.log(cal.allInputEl(el)[1].value);
        if (cal.allInputEl(el)[1].value !== '' && cal.allInputEl(el)[1].value !== '0' && cal.allInputEl(el)[1].value !== '0.0' && cal.allInputEl(el)[1].value !== '0.00') {
          cal.allInputEl(el)[3].value = (cal.remSep(cal.allInputEl(el)[2].value) / cal.remSep(cal.allInputEl(el)[1].value)).toLocaleString();
        }
      });
    },
    AutomaticCalculation(i, className, event) {
      let currentEl;
      if (event !== '') {
        currentEl = event.target;
      }
      cal.whereUse('monthIndex');
      cal.getVueSigningRatio(this.SigningRatio);
      if (className !== 'F1') {
        currentEl.value = Number(currentEl.value).toLocaleString();
      }
      this.currentMonthAutomaticCalculation(i);
      this.calculatePredeterminedRatio();
      if (event !== '') {
        currentEl.blur();
      }
    },
  },
  created() {
    this.firstLoadingRequest();
  },
};
</script>

<style lang="less" scoped>
  table.KMTable1.commonTable{
    th{
      width: 11.1%;
    }
    td{
      height:30px;
      input{
        width: 100%;
        height: 100%;
        border:none;
        font-size: 16px;
        text-align: center;
      }
    }
  }
  .red{
    color:red;
  }
  .mt10{
    margin-top: 10px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
