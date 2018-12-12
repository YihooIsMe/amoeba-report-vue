<template>
  <div>
    <div class="table-container">
      <h1>阿米巴报表核算系统</h1>
      <div class="submitBtn" v-if="submitBtnShow">
        <div class="top-left">
          {{responseData.UnitName}}{{years}}年年度预定计划
        </div>
        <div class="top-right">
          <el-button type="primary"
                     @click="dataSubmissionRequest(0)"
                     v-if="showDraftAndSubmit"
          >保存到草稿箱</el-button>
          <el-button type="success"
                     @click="dataSubmissionRequest(1)"
                     v-if="showDraftAndSubmit"
          >数据提交</el-button>
          <el-button type="success"
                     icon="el-icon-success"
                     v-if="showReviewAndReject"
                     @click="ReviewOrReject(2)"
          >审核通过</el-button>
          <el-button type="danger"
                     icon="el-icon-error"
                     v-if="showReviewAndReject"
                     @click="ReviewOrReject(3)"
          >驳回</el-button>
          <el-button type="warning"
                     v-if="true"
                     @click="hideSubjectWithZero"
          >隐藏整行为0的科目</el-button>
          <el-button type="primary"
                     plain
                     v-if="true"
                     @click="showAllSubject"
          >显示所有科目</el-button>
          <el-button type="success"
                     plain
                     @click="exportAllData"
                     v-if="draft===1"
          >导出</el-button>
        </div>
      </div>
      <div v-for="(tableData, index) in tableDataInject"
           :key="index"
           class="repeat-table-container">
        <div v-if="tableData.length>0">
          <table class="KMTable1 commonTable" border="1">
            <thead>
            <tr>
              <th><i class="el-icon-arrow-down" @click="toggleSubject($event)" id="toggle-icon">科目</i></th>
              <th>历史数据</th>
              <th  v-for="n in 12" :key="n">{{n}}月</th>
              <th>批量删除</th>
              <th>合计</th>
            </tr>
            </thead>
            <tbody>
            <tr  v-for="(item, i) in tableData"
                 :key="i"
                 :class="getForClassName(item.className)">
              <td>{{item.Name}}</td>
              <td><input type="text" readonly :value="item.Amount"></td>
              <td v-for="n in 12"
                  :key="n">
                <input type="number"
                       :readonly="item.ReadOnly === 1?true:false"
                       @focus="inputFocus(n+2,item.className)"
                       @change="AutomaticCalculation(n+2, item.className)"
                       @keydown="handleInputNum"
                       :disabled="inputDisabled"
                >
              </td>
              <td class="delete-btn">
                <el-button type="warning" @click="deleteCurrentLineData(item.className)" :disabled="(item.ReadOnly === 1?true:false) || deleteBtnDisabled">删除</el-button>
              </td>
              <td>
                <input type="number">
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <transition name="fade">
      <ManagementAlert :alertIndex="alertIndex"
                       :SigningRatio="SigningRatio"
                       v-show="isAlertShow"
                       @changeAlertShow="changeShow"
                       @giveSelectedNum="getSigningRatio">
      </ManagementAlert>
    </transition>
    <input type="hidden" value="0" id="zeroVal">
    <iframe src="" frameborder="0" id="exportIframe" ref="exportIframe"></iframe>
  </div>
</template>

<script>
import Vue from 'vue';
import qs from 'qs';
import axios from 'axios';
import VueCookie from 'vue-cookie';
import { MessageBox } from 'element-ui';
import ManagementAlert from './managementAlert.vue';

Vue.component(MessageBox.name, MessageBox);
Vue.use(VueCookie);

export default {
  name: 'tableContainer',
  components: { ManagementAlert },
  data() {
    return {
      isReadOnly: '',
      getUrl: 'http://10.100.250.153:99/api/Subject',
      reviewOrRejectUrl: 'http://10.100.250.153:99/api/Review',
      exportUrl: 'http://10.100.250.153:99/api/downLoad',
      userID: '',
      // userID: '{85811A95-BB15-4914-8926-82E88F5E6E78}', // 权限大
      // userID: '{8F5FF78A-E0C0-40EE-91ED-88B32A247DE9}', // 权限小
      IsYM: 0,
      OrganizeId: '',
      years: new Date().getFullYear() + 1,
      viewEditorYear: '',
      submitBtnShow: false,
      draft: '',
      Pr0139: '',
      Pr0111: '',
      tableSource: [],
      responseData: {},
      tableDataSource0: [], // Type类型为0的数据;
      tableDataSource1: [], // Type类型为1的数据;
      tableDataSource2: [], // Type类型为2的数据;
      tableDataSource3: [], // Type类型为3的数据;
      tableDataSource4: [], // Type类型为4的数据;
      tableDataSource5: [], // Type类型为5的数据;
      tableDataSource6: [], // Type类型为6的数据;
      tableDataSource7: [], // Type类型为7的数据;
      tableDataInject: [],
      isAlertShow: false,
      alertIndex: null,
      SigningRatio: {
        SigningRatio1: 0.1,
        SigningRatio2: 0.1,
        SigningRatio3: 0.1,
        SigningRatio4: 0.1,
        SigningRatio5: 0.1,
        SigningRatio6: 0.1,
        SigningRatio7: 0.1,
        SigningRatio8: 0.1,
        SigningRatio9: 0.1,
        SigningRatio10: 0.1,
        SigningRatio11: 0.1,
        SigningRatio12: 0.1,
      },
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      pullAllData: {},
      isInputValEmpty: true,
      DraftData: [],
      CreateByUser: '',
      inputDisabled: false,
      ReviewOrRejectMPID: '',
      fillStatus: '',
      showReviewAndReject: false,
      showDraftAndSubmit: false,
      deleteBtnDisabled: '',
      currentLineZero: '',
    };
  },
  methods: {
    getFillStatus() {
      this.fillStatus = VueCookie.get('fillStatus');
    },

    getForClassName(el) {
      return el;
    },

    inputFocus(i, className) {
      if (className === 'F1') {
        this.alertIndex = i;
        this.isAlertShow = true;
      } else {
        this.isCurrentLineEmpty(className);
      }
    },

    handleInputNum(e) {
      if (e.keyCode !== 8) {
        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null;
        // e.target.value = (e.target.value.match(/^[1-9]\d*/g)[0]) || null;
        // e.target.value = (e.target.value.match(/^\d+$/g)[0]) || null;
      }
      /*
      if (e.target.value.length === 1) {
        e.target.value = e.target.value.replace(/[^1-9]/g, '');
      } else {
        e.target.value = e.target.value.replace(/\D/g, '');
      }
      */
    },

    changeShow() {
      this.isAlertShow = false;
    },

    toggleSubject(event) {
      const toggleChildNodes = event.target.parentNode.parentNode.parentNode.nextSibling.childNodes;
      const toggleChildNodesLen = toggleChildNodes.length;
      const isF5 = toggleChildNodes[0].getAttribute('class').indexOf('F') !== -1;
      if (event.target.getAttribute('class') === 'el-icon-arrow-down') {
        this.$nextTick(() => {
          if (!isF5) {
            for (let i = 0; i < toggleChildNodesLen - 1; i += 1) {
              toggleChildNodes[i].classList.add('toggle-subject');
            }
          } else {
            for (let i = 0; i < toggleChildNodesLen - 2; i += 1) {
              toggleChildNodes[i].classList.add('toggle-subject');
            }
          }
        });
        event.target.setAttribute('class', 'el-icon-arrow-up');
      } else {
        this.$nextTick(() => {
          if (!isF5) {
            for (let i = 0; i < toggleChildNodesLen - 1; i += 1) {
              toggleChildNodes[i].classList.remove('toggle-subject');
            }
          } else {
            for (let i = 0; i < toggleChildNodesLen - 2; i += 1) {
              toggleChildNodes[i].classList.remove('toggle-subject');
            }
          }
        });
        event.target.setAttribute('class', 'el-icon-arrow-down');
      }
    },

    oneToTwelveSum(className) {
      const currentLine = document.querySelectorAll('table.KMTable1.commonTable tr.' + className + ' input');
      console.log(currentLine);
      let baseNum = 0;
      for (let i = 1; i < 13; i += 1) {
        baseNum = Number(currentLine[i].value) + baseNum;
      }
      currentLine[13].value = baseNum;
    },

    getSigningRatio(val) {
      this.SigningRatio['SigningRatio' + (this.alertIndex - 2)] = val;
      this.isAlertShow = false;
      this.AutomaticCalculation(this.alertIndex, 'F1');
    },

    getAfterSubmissionAlertInfo(msg, DZIndex) {
      MessageBox.alert(msg, '', {
        confirmButtonText: '确定',
        showClose: true,
        callback: (action) => {
          if (action === 'confirm') {
            if (DZIndex === 0) {
              console.log('数据保存草稿箱成功!');
            } else {
              console.log('数据已经提交成功!');
            }
            this.readFromDraftBoxRequest();
          }
        },
      });
    },

    hideSubjectWithZero() {
      this.tableSource.forEach((item) => {
        this.currentLineZero = '';
        const allInputEl = document.querySelectorAll('table.KMTable1.commonTable tr.' + item.className + ' input');
        let sumData = 0;
        for (let i = 1; i < 13; i += 1) {
          sumData = Number(allInputEl[i].value) + sumData;
        }

        if ((sumData === 0 || sumData === 0.0 || sumData === 0.00) && (allInputEl[0].value === '0' || allInputEl[0].value === '0.0' || allInputEl[0].value === '0.00')) {
          this.currentLineZero = true;
          document.querySelector('table.KMTable1.commonTable tr.' + item.className).style.display = 'none';
        } else {
          this.currentLineZero = false;
        }
      });
    },

    showAllSubject() {
      window.location.reload();
    },

    firstLoadingRequest() {
      this.userID = VueCookie.get('userID');
      this.CreateByUser = VueCookie.get('CreateByUser');
      this.viewEditorYear = VueCookie.get('viewEditorYear');
      // this.Pr0139 = VueCookie.get('Pr0139');
      let paramsArgs;
      if (VueCookie.get('fromWhichBtn') === 'newAdded') {
        paramsArgs = {
          userID: this.userID,
          IsYM: this.IsYM,
          Year: this.years,
        };
      }
      if (VueCookie.get('fromWhichBtn') === 'viewEditorBtn') {
        paramsArgs = {
          userID: this.CreateByUser,
          IsYM: this.IsYM,
          Year: this.viewEditorYear,
        };
      }
      axios.get(this.getUrl, {
        params: paramsArgs,
      }).then((response) => {
        this.responseData = JSON.parse(response.data);
        console.log(this.responseData);
        this.OrganizeId = this.responseData.OrganizeId;
        this.draft = this.responseData.draft;
        this.Pr0139 = this.responseData.Pr0139;
        Vue.set(this.pullAllData, 'OrganizeId', this.OrganizeId);
        Vue.set(this.pullAllData, 'City', this.responseData.City);
        Vue.set(this.pullAllData, 'years', this.years); // 目前years暂无传参；
        Vue.set(this.pullAllData, 'MPID', this.responseData.MPID); // MPID暂无传参；
        Vue.set(this.pullAllData, 'ParentId', this.responseData.ParentId);
        Vue.set(this.pullAllData, 'JobAttribute', this.responseData.JobAttribute);
        Vue.set(this.pullAllData, 'userID', this.responseData.userID);
        Vue.set(this.pullAllData, 'Pr0139', this.responseData.Pr0139);
        Vue.set(this.pullAllData, 'SupervisorNumber', this.responseData.SupervisorNumber);
        Vue.set(this.pullAllData, 'draft', this.draft);
        Vue.set(this.pullAllData, 'F_RealName', this.responseData.F_RealName);
        Vue.set(this.pullAllData, 'UnitName', this.responseData.UnitName);
        Vue.set(this.pullAllData, 'Company', this.responseData.Company);
        Vue.set(this.pullAllData, 'District', this.responseData.District);
        Vue.set(this.pullAllData, 'Pr0111', this.responseData.Pr0111);
        this.tableSource = JSON.parse(response.data).list;
        console.log(this.tableSource);
        this.injectTableSourceData();
        for (let i = 0; i < 8; i += 1) {
          this.tableDataInject.push(this['tableDataSource' + i]);
        }
        this.submitBtnShow = true;
        this.$nextTick(() => {
          for (let j = 3; j < 15; j += 1) {
            document.querySelector('.F5>td:nth-child(' + j + ')>input').value = this.SigningRatio['SigningRatio' + (j - 2)];
          }
        });
        this.$emit('closeFirstFullscreenLoading');
        this.readFromDraftBoxRequest();
      }).catch((error) => {
        console.log(error);
      });
    },

    setDZValue(index) {
      Vue.set(this.pullAllData, 'DZ', index); // 0表示保存草稿  1表示提交审核
    },

    dataSubmissionRequest(DZIndex) {
      this.$emit('saveToDraftBox', '数据正在提交中，请稍后');
      const getSubmitData = this.tableSource;// LIST下的86个数据
      const submitListsArr = [];
      console.log(getSubmitData);
      for (let i = 0; i < getSubmitData.length; i += 1) {
        const submitObj = {};
        submitObj.SubjectID = getSubmitData[i].SubjectID;
        submitObj.MPID = this.responseData.MPID;
        submitObj.OrganizeId = this.OrganizeId;
        submitObj.years = this.years;
        if (this.draft === 1) {
          submitObj.ID = this.DraftData[i].ID;
        }
        const dataClassName = getSubmitData[i].className;
        const allInput = document.querySelectorAll('table.commonTable .' + dataClassName + ' input');
        for (let j = 0; j < 12; j += 1) {
          submitObj[this.months[j]] = allInput[(j + 1)].value;
        }
        submitListsArr.push(submitObj);
      }
      this.setDZValue(DZIndex);
      Vue.set(this.pullAllData, 'list', submitListsArr);
      console.log(this.pullAllData);

      axios({
        method: 'POST',
        url: this.getUrl,
        data: qs.stringify(this.pullAllData),
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }).then((res) => {
        console.log(res);
        this.$emit('saveToDraftBoxCompleted');
        this.getAfterSubmissionAlertInfo(res.data.errorMessage, DZIndex);
      }).catch((error) => {
        console.log(error);
      });
    },

    readFromDraftBoxRequest() {
      this.$emit('getDataFromDraft', '正在读取草稿箱数据，请稍后...');
      axios.get(this.getUrl, {
        params: {
          Pr0139: this.Pr0139,
          years: this.years,
        },
      }).then((response) => {
        this.$emit('readDraftCompleted');
        this.DraftData = JSON.parse(response.data);
        console.log(this.DraftData);
        if (this.DraftData.length > 0) {
          this.ReviewOrRejectMPID = this.DraftData[0].MPID;
        }
        this.DraftData.forEach((item) => {
          const allInputEl = document.querySelectorAll('tr.' + item.className + '>td>input');
          for (let i = 0; i < 12; i += 1) {
            allInputEl[(i + 1)].value = item[this.months[i]];
            if (item.className === 'F5') {
              this.SigningRatio['SigningRatio' + (i + 1)] = item[this.months[i]];
            }
          }
        });
      }).catch((msg) => {
        console.log(msg);
      });
    },

    getTypeObj(tableDataSource, data) {
      const obj = {
        ReadOnly: data.ReadOnly,
        Name: data.Name,
        className: data.className,
        Amount: data.Amount,
      };
      tableDataSource.push(obj);
    },

    injectTableSourceData() {
      this.tableSource.forEach((item) => {
        this.getTypeObj(this['tableDataSource' + item.Type], item);
      });
    },

    /* Type类型为0时 */
    tableOne(index) {
      return {
        /* 原始签约金 */
        OriginalContractFee: document.querySelector('tr.A0>td:nth-child(' + index + ') input'),
        /* 减：折让退回 */
        DiscountRefund: document.querySelector('tr.A1>td:nth-child(' + index + ') input'),
        /* 营业收入合计 */
        TotalOperatingIncome: document.querySelector('tr.A3>td:nth-child(' + index + ') input'),
        /* 減：营业税金 */
        BusinessTax: document.querySelector('tr.A4>td:nth-child(' + index + ') input'),
        /* 营业收入净额 */
        OperatingNetProfit: document.querySelector('tr.A5>td:nth-child(' + index + ') input'),
        /* 收入合计 */
        TotalIncome: document.querySelector('tr.A6>td:nth-child(' + index + ') input'),
      };
    },
    tableOneCalculation(index) {
      /** 营业收入合计* */
      if (this.tableOne(index).TotalOperatingIncome) {
        this.tableOne(index).TotalOperatingIncome.value = (Number(this.tableOne(index).OriginalContractFee.value) - Number(this.tableOne(index).DiscountRefund.value)).toFixed(2);
      }
      /** 減：营业税金* */
      if (this.tableOne(index).BusinessTax) {
        this.tableOne(index).BusinessTax.value = Number(this.tableOne(index).TotalOperatingIncome.value * 0.05).toFixed(2);
      }
      /* 营业收入净额 */
      if (this.tableOne(index).OperatingNetProfit) {
        this.tableOne(index).OperatingNetProfit.value = (Number(this.tableOne(index).TotalOperatingIncome.value) - Number(this.tableOne(index).BusinessTax.value)).toFixed(2);
      }
      /* 收入合计 */
      if (this.tableOne(index).TotalIncome) {
        this.tableOne(index).TotalIncome.value = (Number(this.tableOne(index).OperatingNetProfit.value)).toFixed(2);
      }
    },

    /* Type类型为1时 */
    tableTwo(index) {
      return {
        /* 工资 */
        Wage: document.querySelector('tr.B0>td:nth-child(' + index + ') input'),
        /* 固定工资 */
        FixedSalary: document.querySelector('tr.B1>td:nth-child(' + index + ') input'),
        /* 变动工资 */
        VariableWage: document.querySelector('tr.B2>td:nth-child(' + index + ') input'),
        /* 预提奖金 */
        WithholdingBonus: document.querySelector('tr.B3>td:nth-child(' + index + ') input'),
        /* 福利费 */
        WelfareFee: document.querySelector('tr.B4>td:nth-child(' + index + ') input'),
        /* 住宿费 */
        AccommodationFee: document.querySelector('tr.B5>td:nth-child(' + index + ') input'),
        /* 社会保险金 */
        SocialInsurancePremium: document.querySelector('tr.B6>td:nth-child(' + index + ') input'),
        /* 人身保险 */
        LifeInsurance: document.querySelector('tr.B7>td:nth-child(' + index + ') input'),
        /* 工作餐费 */
        WorkingMeal: document.querySelector('tr.B8>td:nth-child(' + index + ') input'),
        /* 制服费 */
        UniformFee: document.querySelector('tr.B9>td:nth-child(' + index + ') input'),
        /* 车贴 */
        CarSticker: document.querySelector('tr.B10>td:nth-child(' + index + ') input'),
        /* 教育训练费 */
        EducationalTrainingFee: document.querySelector('tr.B11>td:nth-child(' + index + ') input'),
        /* 劳务费 */
        LaborCosts: document.querySelector('tr.B12>td:nth-child(' + index + ') input'),
        /* 公积金 */
        ProvidentFund: document.querySelector('tr.B13>td:nth-child(' + index + ') input'),
        /* 用人费用 */
        EmploymentFee: document.querySelector('tr.B14>td:nth-child(' + index + ') input'),
      };
    },
    tableTwoCalculation(index) {
      /* 工资 */
      this.tableTwo(index).Wage.value = (Number(this.tableTwo(index).FixedSalary.value) + Number(this.tableTwo(index).VariableWage.value)).toFixed(2);
      /* 社会保险金 */
      this.tableTwo(index).SocialInsurancePremium.value = (Number(this.tableTwo(index).Wage.value * 0.305)).toFixed(2);
      /* 公积金 */
      this.tableTwo(index).ProvidentFund.value = (Number(this.tableTwo(index).Wage.value * 0.07)).toFixed(2);
      /* 用人费用 */
      this.tableTwo(index).EmploymentFee.value = (Number(this.tableTwo(index).Wage.value) + Number(this.tableTwo(index).WithholdingBonus.value) + Number(this.tableTwo(index).WelfareFee.value) + Number(this.tableTwo(index).AccommodationFee.value) + Number(this.tableTwo(index).SocialInsurancePremium.value) + Number(this.tableTwo(index).LifeInsurance.value) + Number(this.tableTwo(index).WorkingMeal.value) + Number(this.tableTwo(index).UniformFee.value) + Number(this.tableTwo(index).CarSticker.value) + Number(this.tableTwo(index).EducationalTrainingFee.value) + Number(this.tableTwo(index).LaborCosts.value) + Number(this.tableTwo(index).ProvidentFund.value)).toFixed(2);
    },

    /* Type类型为2时 */
    tableThree(index) {
      return {
        /* 折旧费 */
        Depreciation: document.querySelector('tr.C0>td:nth-child(' + index + ') input'),
        /* 有形资产摊销 */
        AmortizationOfTangibleAssets: document.querySelector('tr.C1>td:nth-child(' + index + ') input'),
        /* 低值易耗品摊销 */
        LowValueConsumablesAmortization: document.querySelector('tr.C2>td:nth-child(' + index + ') input'),
        /* 修理费 */
        RepairFee: document.querySelector('tr.C3>td:nth-child(' + index + ') input'),
        /* 店面租金 */
        StoreRent: document.querySelector('tr.C5>td:nth-child(' + index + ') input'),
        /* 设备租金 */
        EquipmentRent: document.querySelector('tr.C6>td:nth-child(' + index + ') input'),
        /* 财产保险 */
        PropertyRent: document.querySelector('tr.C7>td:nth-child(' + index + ') input'),
        /* 租赁费 */
        RentalFees: document.querySelector('tr.C4>td:nth-child(' + index + ') input'),
        /* 设备费用 */
        EquipmentCost: document.querySelector('tr.C8>td:nth-child(' + index + ') input'),
      };
    },
    tableThreeCalculation(index) {
      /* 租赁费 */
      this.tableThree(index).RentalFees.value = (Number(this.tableThree(index).StoreRent.value) + Number(this.tableThree(index).EquipmentRent.value)).toFixed(2);
      /* 设备费用 */
      this.tableThree(index).EquipmentCost.value = (Number(this.tableThree(index).Depreciation.value) + Number(this.tableThree(index).AmortizationOfTangibleAssets.value) + Number(this.tableThree(index).LowValueConsumablesAmortization.value) + Number(this.tableThree(index).RepairFee.value) + Number(this.tableThree(index).RentalFees.value) + Number(this.tableThree(index).PropertyRent.value)).toFixed(2);
    },

    /* Type类型为3时 */
    tableFour(index) {
      return {
        /* 办公费-市话费 */
        CityCallFee: document.querySelector('tr.D1>td:nth-child(' + index + ') input'),
        /* 办公费-网络通讯费 */
        NetworkCommunicationFee: document.querySelector('tr.D2>td:nth-child(' + index + ') input'),
        /* 办公费-其他 */
        OfficeFeeOtherFee: document.querySelector('tr.D3>td:nth-child(' + index + ') input'),
        /* 办公费-办公用品 */
        OfficeSupplies: document.querySelector('tr.D4>td:nth-child(' + index + ') input'),
        /* 办公费-长话费 */
        LongDistanceFee: document.querySelector('tr.D5>td:nth-child(' + index + ') input'),
        /* 办公费-短信费 */
        SMSCharges: document.querySelector('tr.D6>td:nth-child(' + index + ') input'),
        /* 差旅费-市内交通费 */
        CityTransportationFee: document.querySelector('tr.D8>td:nth-child(' + index + ') input'),
        /* 差旅费-出差旅费 */
        TravelExpenses: document.querySelector('tr.D9>td:nth-child(' + index + ') input'),
        /* 印刷费 */
        PrintingFee: document.querySelector('tr.D11>td:nth-child(' + index + ') input'),
        /* 水电费 */
        UtilityFee: document.querySelector('tr.D12>td:nth-child(' + index + ') input'),
        /* 交际费 */
        CommunicationFee: document.querySelector('tr.D13>td:nth-child(' + index + ') input'),
        /* 产调 */
        ProductionAdjustment: document.querySelector('tr.D14>td:nth-child(' + index + ') input'),
        /* 审计费 */
        AuditFees: document.querySelector('tr.D15>td:nth-child(' + index + ') input'),
        /* 税金 */
        Tax: document.querySelector('tr.D16>td:nth-child(' + index + ') input'),
        /* 运费 */
        Freight: document.querySelector('tr.D17>td:nth-child(' + index + ') input'),
        /* 会费 */
        MembershipFee: document.querySelector('tr.D18>td:nth-child(' + index + ') input'),
        /* 书报费 */
        BookFee: document.querySelector('tr.D19>td:nth-child(' + index + ') input'),
        /* 坏账准备 */
        BadDebtProvision: document.querySelector('tr.D20>td:nth-child(' + index + ') input'),
        /* 技术顾问费 */
        TechnicalAdvisoryFee: document.querySelector('tr.D28>td:nth-child(' + index + ') input'),
        /* 规费 */
        Fees: document.querySelector('tr.D21>td:nth-child(' + index + ') input'),
        /* 加盟费 */
        InitialFee: document.querySelector('tr.D22>td:nth-child(' + index + ') input'),
        /* 中人费 */
        ZhongRenFee: document.querySelector('tr.D30>td:nth-child(' + index + ') input'),
        /* 诉讼费 */
        LitigationCosts: document.querySelector('tr.D23>td:nth-child(' + index + ') input'),
        /* 其他 */
        otherFee: document.querySelector('tr.D24>td:nth-child(' + index + ') input'),
        /* 办公费 */
        FourOfficeFee: document.querySelector('tr.D0>td:nth-child(' + index + ') input'),
        /* 差旅费 */
        FourTravelExpenses: document.querySelector('tr.D7>td:nth-child(' + index + ') input'),
        /* 事务费用 */
        TotalTransactionCost: document.querySelector('tr.D29>td:nth-child(' + index + ') input'),
      };
    },
    tableFourCalculation(index) {
      /* 办公费 */
      this.tableFour(index).FourOfficeFee.value = (Number(this.tableFour(index).CityCallFee.value) + Number(this.tableFour(index).NetworkCommunicationFee.value) + Number(this.tableFour(index).OfficeSupplies.value) + Number(this.tableFour(index).OfficeFeeOtherFee.value) + Number(this.tableFour(index).LongDistanceFee.value) + Number(this.tableFour(index).SMSCharges.value)).toFixed(2);
      /* 差旅费 */
      this.tableFour(index).FourTravelExpenses.value = (Number(this.tableFour(index).CityTransportationFee.value) + Number(this.tableFour(index).TravelExpenses.value)).toFixed(2);
      /* 事务费用 */
      this.tableFour(index).TotalTransactionCost.value = (Number(this.tableFour(index).FourOfficeFee.value) + Number(this.tableFour(index).FourTravelExpenses.value) + Number(this.tableFour(index).PrintingFee.value) + Number(this.tableFour(index).UtilityFee.value) + Number(this.tableFour(index).CommunicationFee.value) + Number(this.tableFour(index).ProductionAdjustment.value) + Number(this.tableFour(index).AuditFees.value) + Number(this.tableFour(index).Tax.value) + Number(this.tableFour(index).Freight.value) + Number(this.tableFour(index).MembershipFee.value) + Number(this.tableFour(index).BookFee.value) + Number(this.tableFour(index).BadDebtProvision.value) + Number(this.tableFour(index).Fees.value) + Number(this.tableFour(index).InitialFee.value) + Number(this.tableFour(index).LitigationCosts.value) + Number(this.tableFour(index).otherFee.value) + Number(this.tableFour(index).ZhongRenFee.value) + Number(this.tableFour(index).TechnicalAdvisoryFee.value)).toFixed(2);
    },

    /* Type类型为4时 */
    tableFive(index) {
      return {
        /* 广告费-案源-派报 */
        AdvertisingFeeCaseSourceReport: document.querySelector('tr.E1>td:nth-child(' + index + ') input'),
        /* 广告费-案源-报刊 */
        AdvertisingFeeCaseSourcePress: document.querySelector('tr.E2>td:nth-child(' + index + ') input'),
        /* 广告费-案源-电视 */
        AdvertisingFeeCaseSourceTV: document.querySelector('tr.E3>td:nth-child(' + index + ') input'),
        /* 广告费-案源-看板横幅 */
        AdvertisingFeeCaseSourceKanbanBanner: document.querySelector('tr.E4>td:nth-child(' + index + ') input'),
        /* 广告费-案源-其他 */
        AdvertisingFeeCaseSourceOther: document.querySelector('tr.E5>td:nth-child(' + index + ') input'),
        /* 广告费-形象-派报 */
        AdvertisingFeeImageReport: document.querySelector('tr.E6>td:nth-child(' + index + ') input'),
        /* 广告费-形象-报刊 */
        AdvertisingFeeImagePress: document.querySelector('tr.E7>td:nth-child(' + index + ') input'),
        /* 广告费-形象-电视 */
        AdvertisingFeeImageTV: document.querySelector('tr.E8>td:nth-child(' + index + ') input'),
        /* 广告费-形象-看板横幅 */
        AdvertisingFeeImageKanbanBanner: document.querySelector('tr.E17>td:nth-child(' + index + ') input'),
        /* 广告费-形象-其他 */
        AdvertisingFeeImageOther: document.querySelector('tr.E9>td:nth-child(' + index + ') input'),
        /* 行销费-展会 */
        MarketingFeeExhibition: document.querySelector('tr.E10>td:nth-child(' + index + ') input'),
        /* 行销费-促销活动 */
        MarketingFeePromotions: document.querySelector('tr.E11>td:nth-child(' + index + ') input'),
        /* 行销费-代理合作 */
        MarketingFeeAgencyCooperation: document.querySelector('tr.E12>td:nth-child(' + index + ') input'),
        /* 行销费-设计制作 */
        MarketingFeeDesignProduction: document.querySelector('tr.E13>td:nth-child(' + index + ') input'),
        /* 行销费-现场布置 */
        MarketingFeeSiteLayout: document.querySelector('tr.E14>td:nth-child(' + index + ') input'),
        /* 行销费-其他 */
        MarketingFeeOther: document.querySelector('tr.E15>td:nth-child(' + index + ') input'),
        /* 广告费 */
        AdvertisingFee: document.querySelector('tr.E0>td:nth-child(' + index + ') input'),
        /* 行销费 */
        MarketingFee: document.querySelector('tr.E16>td:nth-child(' + index + ') input'),
        /* 行销費用 */
        TotalMarketingFee: document.querySelector('tr.E20>td:nth-child(' + index + ') input'),
      };
    },
    tableFiveCalculation(index) {
      /* 广告费 */
      this.tableFive(index).AdvertisingFee.value = (Number(this.tableFive(index).AdvertisingFeeCaseSourceReport.value) + Number(this.tableFive(index).AdvertisingFeeCaseSourcePress.value) + Number(this.tableFive(index).AdvertisingFeeCaseSourceTV.value) + Number(this.tableFive(index).AdvertisingFeeCaseSourceKanbanBanner.value) + Number(this.tableFive(index).AdvertisingFeeCaseSourceOther.value) + Number(this.tableFive(index).AdvertisingFeeImageReport.value) + Number(this.tableFive(index).AdvertisingFeeImagePress.value) + Number(this.tableFive(index).AdvertisingFeeImageTV.value) + Number(this.tableFive(index).AdvertisingFeeImageOther.value) + Number(this.tableFive(index).AdvertisingFeeImageKanbanBanner.value)).toFixed(2);
      /* 行销费 */
      this.tableFive(index).MarketingFee.value = (Number(this.tableFive(index).MarketingFeeExhibition.value) + Number(this.tableFive(index).MarketingFeePromotions.value) + Number(this.tableFive(index).MarketingFeeAgencyCooperation.value) + Number(this.tableFive(index).MarketingFeeDesignProduction.value) + Number(this.tableFive(index).MarketingFeeSiteLayout.value) + Number(this.tableFive(index).MarketingFeeOther.value)).toFixed(2);
      /* 行销費用 */
      this.tableFive(index).TotalMarketingFee.value = (Number(this.tableFive(index).AdvertisingFee.value) + Number(this.tableFive(index).MarketingFee.value)).toFixed(2);
    },

    /* Type类型为5时 */
    tableSix(index) {
      return {
        /* 管理服务费 */
        ManagementServiceFee: document.querySelector('tr.F1>td:nth-child(' + index + ') input'),
        /* 營業支出 */
        OperatingExpenses: document.querySelector('tr.F0>td:nth-child(' + index + ') input'),
        /* 签约金损益 */
        SigningFeeProfitAndLoss: document.querySelector('tr.F3>td:nth-child(' + index + ') input'),
        /* 签约金损益收益率 */
        ContractedFeeProfitAndLossYield: document.querySelector('tr.F4>td:nth-child(' + index + ') input'),
      };
    },
    tableSixCalculation(index) {
      /* 营业支出 */
      this.tableSix(index).OperatingExpenses.value = (Number(this.tableTwo(index).EmploymentFee.value) + Number(this.tableThree(index).EquipmentCost.value) + Number(this.tableFour(index).TotalTransactionCost.value) + Number(this.tableFive(index).TotalMarketingFee.value)).toFixed(2);
      /* 管理服务费 */
      this.tableSix(index).ManagementServiceFee.value = (Number(this.tableOne(index).OriginalContractFee.value) * Number(this.SigningRatio['SigningRatio' + (index - 2)]) + 12000).toFixed(2);
      /* 签约金损益 */
      this.tableSix(index).SigningFeeProfitAndLoss.value = (Number(this.tableOne(index).OperatingNetProfit.value) - Number(this.tableSix(index).OperatingExpenses.value) - Number(this.tableSix(index).ManagementServiceFee.value)).toFixed(2);
      /* 签约金损益收益率 */
      if (Number(this.tableOne(index).TotalIncome.value) !== 0) {
        this.tableSix(index).ContractedFeeProfitAndLossYield.value = (Number(this.tableSix(index).SigningFeeProfitAndLoss.value) / Number(this.tableOne(index).TotalIncome.value)).toFixed(2);
      }
    },

    /* Type类型为6时 */
    tableSeven(index) {
      return {
        /* 业绩 */
        Performance: document.querySelector('tr.G0>td:nth-child(' + index + ') input'),
        /* 业绩损益 */
        PerformanceGainsAndLosses: document.querySelector('tr.G1>td:nth-child(' + index + ') input'),
        /* 业绩损益收益率 */
        PerformanceGainsAndLossesRate: document.querySelector('tr.G2>td:nth-child(' + index + ') input'),
      };
    },
    tableSevenCalculation(index) {
      /* 业绩损益 */
      this.tableSeven(index).PerformanceGainsAndLosses.value = (Number(this.tableSeven(index).Performance.value) - Number(this.tableSix(index).ManagementServiceFee.value) - Number(this.tableSix(index).OperatingExpenses.value) - Number(this.tableOne(index).BusinessTax.value)).toFixed(2);
      /* 业绩损益收益率 */
      if (Number(this.tableSeven(index).Performance.value) !== 0) {
        this.tableSeven(index).PerformanceGainsAndLossesRate.value = (Number(this.tableSeven(index).PerformanceGainsAndLosses.value) / Number(this.tableSeven(index).Performance.value)).toFixed(2);
      }
    },

    /* Type类型为7时 */
    tableEight(index) {
      return {
        /* 单位时间损益 */
        UnitTimeProfitAndLoss: document.querySelector('tr.H1>td:nth-child(' + index + ') input'),
        /* 出勤时间 */
        AttendanceTime: document.querySelector('tr.H0>td:nth-child(' + index + ') input'),
      };
    },
    tableEightCalculation(index) {
      /* 单位时间损益 */
      if (Number(this.tableEight(index).AttendanceTime.value) !== 0) {
        this.tableEight(index).UnitTimeProfitAndLoss.value = (Number(this.tableSix(index).SigningFeeProfitAndLoss.value) / Number(this.tableEight(index).AttendanceTime.value)).toFixed(2);
      }
    },

    /* 判断当前行是否已经有数据填写 */
    isCurrentLineEmpty(className) {
      this.isInputValEmpty = true;
      const currentLineInput = document.querySelectorAll('table.commonTable .' + className + ' input');
      for (let i = 1; i < 13; i += 1) {
        if (currentLineInput[i].value !== '') {
          this.isInputValEmpty = false;
          break;
        }
      }
    },

    deleteCurrentLineData(className) {
      this.isCurrentLineEmpty(className);
      if (!this.isInputValEmpty) {
        const currentLineTr = document.querySelectorAll('table.commonTable .' + className + '>td>input');
        for (let i = 1; i < 13; i += 1) {
          currentLineTr[i].value = '';
        }
        this.AllMonthsAutomaticCalculation();
        this.isInputValEmpty = true;
      }
    },
    /* 当前行没有数据的时候，任一月份输入数据，12个月均会填充此数据 */
    autoFillTwelveMonthData(index, className) {
      const currentInputValue = document.querySelector('table.commonTable .' + className + '>td:nth-child(' + index + ') input').value;
      const currentLineTr = document.querySelectorAll('table.commonTable .' + className + '>td>input');
      for (let i = 1; i < 13; i += 1) {
        currentLineTr[i].value = currentInputValue;
      }
      this.isInputValEmpty = false;
    },

    allTableCalculation(index) {
      /* oneTable  start ! */
      this.tableOneCalculation(index);
      /* oneTable  end ! */

      /* twoTable 开始 */
      this.tableTwoCalculation(index);
      /* twoTable end */

      /* threeTable 开始 */
      this.tableThreeCalculation(index);
      /* threeTable end */

      /* fourTable 开始 */
      this.tableFourCalculation(index);
      /* fourTable end */

      /* fiveTable 开始 */
      this.tableFiveCalculation(index);
      /* fiveTable end */

      /* sixTable 开始 */
      this.tableSixCalculation(index);
      /* sixTable end */

      /* sevenTable 开始 */
      this.tableSevenCalculation(index);
      /* sevenTable end */

      /* eightTable 开始 */
      this.tableEightCalculation(index);
      /* eightTable end */
    },

    AllMonthsAutomaticCalculation() {
      for (let index = 3; index < 15; index += 1) {
        this.allTableCalculation(index);
      }
    },

    currentMonthAutomaticCalculation(index) {
      this.allTableCalculation(index);
    },

    AutomaticCalculation(i, className) {
      if (className !== 'F1') {
        if (this.isInputValEmpty) {
          this.autoFillTwelveMonthData(i, className);
          this.AllMonthsAutomaticCalculation();
        } else {
          this.currentMonthAutomaticCalculation(i);
        }
      } else {
        this.currentMonthAutomaticCalculation(i);
      }
      this.oneToTwelveSum(className);
    },

    judgeInputDisabled() {
      if (VueCookie.get('fromWhichBtn') === 'newAdded') {
        this.showReviewAndReject = false;
        if (this.fillStatus === '未填写' || this.fillStatus === '填写中' || this.fillStatus === '驳回') {
          this.showDraftAndSubmit = true;
        } else {
          this.showDraftAndSubmit = false;
        }
        if (this.fillStatus === '待审核' || this.fillStatus === '审核通过') {
          this.deleteBtnDisabled = true;
          this.inputDisabled = true;
        } else {
          this.deleteBtnDisabled = false;
          this.inputDisabled = false;
        }
      } else {
        if (this.userID !== this.CreateByUser) {
          this.deleteBtnDisabled = true;
          this.showDraftAndSubmit = false;
          this.inputDisabled = true;
          if (this.fillStatus === '待审核') {
            this.showReviewAndReject = true;
          } else {
            this.showReviewAndReject = false;
          }
        } else {
          this.showReviewAndReject = false;
          if (this.fillStatus === '未填写' || this.fillStatus === '填写中' || this.fillStatus === '驳回') {
            this.showDraftAndSubmit = true;
          } else {
            this.showDraftAndSubmit = false;
          }
          if (this.fillStatus !== '待审核' && this.fillStatus !== '审核通过') {
            this.deleteBtnDisabled = false;
            this.inputDisabled = false;
          } else {
            this.deleteBtnDisabled = true;
            this.inputDisabled = true;
          }
        }
      }
    },

    ReviewOrReject(index) {
      axios.get(this.reviewOrRejectUrl, {
        params: {
          MPID: this.ReviewOrRejectMPID,
          status: index,
          User: VueCookie.get('userID'),
        },
      }).then((res) => {
        console.log(res);
        let content;
        if (index === 2) {
          content = '您已经审核通过!';
        } else {
          content = '您已经驳回了！';
        }
        MessageBox.alert(content, '提示', {
          confirmButtonText: '确定',
          callback(action) {
            console.log(action);
          },
        });
      }).catch((errMsg) => {
        console.log(errMsg);
      });
    },

    exportAllData() {
      this.$refs.exportIframe.setAttribute('src', this.exportUrl + '?MPID=' + this.ReviewOrRejectMPID);
    },
  },

  watch: {
    'SigningRatio.SigningRatio1': function (newVal) {
      document.querySelector('.F5>td:nth-child(3)>input').value = newVal;
    },
    'SigningRatio.SigningRatio2': function (newVal) {
      document.querySelector('.F5>td:nth-child(4)>input').value = newVal;
    },
    'SigningRatio.SigningRatio3': function (newVal) {
      document.querySelector('.F5>td:nth-child(5)>input').value = newVal;
    },
    'SigningRatio.SigningRatio4': function (newVal) {
      document.querySelector('.F5>td:nth-child(6)>input').value = newVal;
    },
    'SigningRatio.SigningRatio5': function (newVal) {
      document.querySelector('.F5>td:nth-child(7)>input').value = newVal;
    },
    'SigningRatio.SigningRatio6': function (newVal) {
      document.querySelector('.F5>td:nth-child(8)>input').value = newVal;
    },
    'SigningRatio.SigningRatio7': function (newVal) {
      document.querySelector('.F5>td:nth-child(9)>input').value = newVal;
    },
    'SigningRatio.SigningRatio8': function (newVal) {
      document.querySelector('.F5>td:nth-child(10)>input').value = newVal;
    },
    'SigningRatio.SigningRatio9': function (newVal) {
      document.querySelector('.F5>td:nth-child(11)>input').value = newVal;
    },
    'SigningRatio.SigningRatio10': function (newVal) {
      document.querySelector('.F5>td:nth-child(12)>input').value = newVal;
    },
    'SigningRatio.SigningRatio11': function (newVal) {
      document.querySelector('.F5>td:nth-child(13)>input').value = newVal;
    },
    'SigningRatio.SigningRatio12': function (newVal) {
      document.querySelector('.F5>td:nth-child(14)>input').value = newVal;
    },
  },
  created() {
    this.firstLoadingRequest();
  },
  mounted() {
    this.getFillStatus();
    this.judgeInputDisabled();
    console.log(this.fillStatus);
  },
};

</script>
<style lang="less" scoped>
  input[type=number]:invalid {
    background-color: red;
  }
  .table-container{
    h1{
      text-align: center;
    }
    .repeat-table-container{
      margin-top: 20px;
    }
  }
  table.KMTable1.commonTable{
    thead{
      tr{
        height: 40px;
        th:first-child{
          cursor: pointer;
          i{
            padding:5px;
          }
          i:before{
            content: '';
          }
          .el-icon-arrow-down:after{
            content: '\E603' !important;
            border:1px solid #ccc;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
          }
          i:hover{
            color:#409eff;
          }
        }
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .submitBtn{
    position: relative;
    height:40px;
    line-height: 40px;
    margin-top: 20px;
    .top-left{
      position:absolute;
      top:0;
      left:0;
      font-size:20px;
      font-weight: bold;
    }
    .top-right{
      position: absolute;
      top:0;
      right:0;
    }
  }
  .F5{
    display: none;
  }
  .delete-btn{
    padding:5px;
    button{
      padding:7px 11px;
    }
  }
  #exportIframe{
    display: none;
  }
  .toggle-subject{
    display: none;
  }
  .el-icon-arrow-up:after{
    content: '\E605' !important;
    border:1px solid #ccc;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
</style>
