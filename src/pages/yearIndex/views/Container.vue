<template>
  <div>
    <div class="table-container">
      <h2>阿米巴报表核算系统</h2>
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
                     @click="hideSubjectWithZero"
          >{{hideZero}}</el-button>
          <el-button type="warning"
                     plain
                     v-if="showDraftAndSubmit"
                     @click="dialogExcelImport = true"
          >Excel导入</el-button>
          <el-button type="info" v-if="withdraw" @click="ReviewOrReject(4)">撤回</el-button>
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
              <td><input type="text" readonly :value="historyData(item)"></td>
              <td v-for="n in 12"
                  :key="n">
                <input type="text"
                       :readonly="item.ReadOnly === 1?true:false"
                       v-on="item.ReadOnly === 0 ? { focus : ($event) => inputFocus(n+2,item.className, $event), blur : ($event) => addSep($event) } : {}"
                       @change="AutomaticCalculation(n+2, item.className, $event)"
                       :disabled="inputDisabled"
                >
              </td>
              <td class="delete-btn">
                <el-button type="warning" @click="deleteCurrentLineData(item.className)" :disabled="(item.ReadOnly === 1?true:false) || deleteBtnDisabled">删除</el-button>
              </td>
              <td>
                <input type="text" readonly>
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
                       :applyWhere="applyWhere"
                       :City="City"
                       v-show="isAlertShow"
                       @changeAlertShow="changeShow"
                       @giveSelectedNum="getSigningRatio">
      </ManagementAlert>
    </transition>
    <iframe src="" frameborder="0" id="exportIframe" ref="exportIframe"></iframe>
    <el-dialog title="Excel导入" :visible.sync="dialogExcelImport">
      <el-upload
        class="upload-excel"
        :multiple='false'
        :auto-upload='true'
        list-type='text'
        :show-file-list='true'
        :before-upload="beforeUpload"
        :drag='true'
        action=''
        :limit="1"
        accept=".xlsx, .xls"
        :on-exceed="handleExceed"
        :http-request="uploadFile" >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">一次只能上传一个文件，仅限.xlsx或.xls格式</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import { MessageBox, Message } from 'element-ui';
import cal from '@/assets/js/comCalculation';
import ManagementAlert from '@/components/managementAlert.vue';
import api from '@/http/index';
import news from '@/assets/js/notification';

Vue.component(MessageBox.name, MessageBox);
Vue.use(api);

export default {
  name: 'tableContainer',
  components: { ManagementAlert },
  data() {
    return {
      isReadOnly: '',
      userID: '',
      IsYM: 0,
      OrganizeId: '',
      exportUrl: process.env.VUE_APP_APIRELEASEADDRESS + '/DownLoad',
      years: '',
      submitBtnShow: false,
      draft: '',
      Pr0139: '',
      Pr0111: '',
      City: '',
      tableSource: [],
      responseData: {},
      tableDataSource0: [],
      tableDataSource1: [],
      tableDataSource2: [],
      tableDataSource3: [],
      tableDataSource4: [],
      tableDataSource5: [],
      tableDataSource6: [],
      tableDataSource7: [],
      tableDataInject: [],
      isAlertShow: false,
      alertIndex: null,
      applyWhere: 'yearIndex',
      SigningRatio: {
        SigningRatio1: 0.15,
        SigningRatio2: 0.15,
        SigningRatio3: 0.15,
        SigningRatio4: 0.15,
        SigningRatio5: 0.15,
        SigningRatio6: 0.15,
        SigningRatio7: 0.15,
        SigningRatio8: 0.15,
        SigningRatio9: 0.15,
        SigningRatio10: 0.15,
        SigningRatio11: 0.15,
        SigningRatio12: 0.15,
      },
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Total'],
      pullAllData: {},
      isInputValEmpty: true,
      DraftData: [],
      inputDisabled: true,
      ReviewOrRejectMPID: '',
      showReviewAndReject: false,
      showDraftAndSubmit: false,
      withdraw: false,
      deleteBtnDisabled: '',
      dialogExcelImport: false,
      hideZero: '隐藏整行为0的数据',
      firstLoading: '',
      fromWhichBtn: '',
      CreateByUser: '',
      viewEditorYear: '',
      ReviewStatus: '',
      SupervisorID: '',
    };
  },
  methods: {
    getQueryVariable(variable) {
      const query = window.location.search.substring(1);
      const vars = query.split('&');
      for (let i = 0; i < vars.length; i += 1) {
        const pair = vars[i].split('=');
        if (pair[0] === variable) {
          return pair[1];
        }
      }
      return false;
    },
    historyData(el) {
      if (el.className === 'F4' || el.className === 'G2') {
        return cal.addPercent(el.Amount);
      }
      return Number(el.Amount).toLocaleString();
    },
    getBaseInfo() {
      this.userID = decodeURI(sessionStorage.getItem('userID'));
      // this.userID = this.getQueryVariable('UserID');
      this.fromWhichBtn = this.getQueryVariable('fromWhichBtn');
      if (this.fromWhichBtn === '1') {
        this.viewEditorYear = this.getQueryVariable('viewEditorYear');
        this.CreateByUser = decodeURI(this.getQueryVariable('CreateByUser'));
      }
    },

    getForClassName(el) {
      return el;
    },

    firstLoadingCover(text) {
      this.firstLoading = this.$loading({
        lock: true,
        text,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'el-loading-info',
      });
    },
    inputFocus(i, className, event) {
      const currentEl = event.target;
      if (className === 'F1' && this.Pr0111 !== 'A2') {
        this.alertIndex = i;
        this.isAlertShow = true;
      } else {
        this.isCurrentLineEmpty(className);
        if (currentEl.value !== '') {
          currentEl.value = cal.remSep(currentEl.value);
        }
      }
    },
    addSep(event) {
      cal.calAddSep(event);
    },

    changeShow() {
      this.isAlertShow = false;
    },

    toggleSubject(event) {
      cal.toggleSubject(event);
    },
    elSelector(name) {
      return document.querySelectorAll('table.KMTable1.commonTable tr.' + name + ' input');
    },
    calProfitLoss(firstClassName, secondClassName, transPer) {
      if (cal.remSep(this.elSelector(secondClassName)[13].value) !== 0) {
        if (transPer) {
          return cal.addPercent(cal.remSep(this.elSelector(firstClassName)[13].value) / cal.remSep(this.elSelector(secondClassName)[13].value));
        }
        return Math.round(cal.remSep(this.elSelector(firstClassName)[13].value) / cal.remSep(this.elSelector(secondClassName)[13].value));
      }
      return '';
    },
    oneToTwelveSum() {
      this.tableSource.forEach((el) => {
        const currentLine = document.querySelectorAll('table.KMTable1.commonTable tr.' + el.className + ' input');
        let baseNum = 0;
        if (el.className === 'F4' || el.className === 'G2' || el.className === 'H1') {
          switch (true) {
            case el.className === 'F4':
              this.elSelector('F4')[13].value = this.calProfitLoss('F3', 'A6', true);
              break;
            case el.className === 'G2':
              this.elSelector('G2')[13].value = this.calProfitLoss('G1', 'G0', true);
              break;
            case el.className === 'H1':
              this.elSelector('H1')[13].value = this.calProfitLoss('F3', 'H0', false);
              break;
            default:
          }
        } else {
          for (let i = 1; i < 13; i += 1) {
            baseNum = cal.remSep(currentLine[i].value) + baseNum;
          }
          currentLine[13].value = baseNum.toLocaleString();
        }
      });
    },

    getSigningRatio(val) {
      this.SigningRatio['SigningRatio' + (this.alertIndex - 2)] = val;
      this.isAlertShow = false;
      this.AutomaticCalculation(this.alertIndex, 'F1', '');
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
            window.location.reload();
          }
        },
      });
    },

    hideSubjectWithZero() {
      if (this.hideZero === '隐藏整行为0的数据') {
        this.hideZero = '显示所有数据';
        this.tableSource.forEach((item) => {
          const allInputEl = document.querySelectorAll('table.KMTable1.commonTable tr.' + item.className + ' input');
          let isZero;
          for (let i = 0; i < 13; i += 1) {
            if (parseFloat(allInputEl[i].value) !== 0 && allInputEl[i].value !== '') {
              isZero = false;
              break;
            } else {
              isZero = true;
            }
          }
          if (isZero) {
            document.querySelector('table.KMTable1.commonTable tr.' + item.className).classList.add('hide-zero');
          }
        });
      } else {
        this.hideZero = '隐藏整行为0的数据';
        const allEl = document.querySelectorAll('table.KMTable1.commonTable tr');
        for (let i = 0; i < allEl.length; i += 1) {
          allEl[i].classList.remove('hide-zero');
        }
      }
    },

    firstLoadingRequest() {
      this.firstLoadingCover('Loading');
      let paramsArgs;
      if (this.fromWhichBtn === '0') {
        paramsArgs = {
          userID: this.userID,
          IsYM: this.IsYM,
          Year: this.years,
        };
      }
      if (this.fromWhichBtn === '1') {
        paramsArgs = {
          userID: this.CreateByUser,
          IsYM: this.IsYM,
          Year: this.viewEditorYear,
        };
      }
      console.log(paramsArgs);
      this.$api.yearLoadingData(paramsArgs)
        .then((response) => {
          this.responseData = JSON.parse(response.data);
          console.log(this.responseData);
          this.OrganizeId = this.responseData.OrganizeId;
          this.draft = this.responseData.draft;
          this.Pr0139 = this.responseData.Pr0139;
          this.ReviewStatus = this.responseData.ReviewStatus;
          this.SupervisorID = this.responseData.SupervisorID;
          this.Pr0111 = this.responseData.Pr0111;
          this.City = this.responseData.City;
          Vue.set(this.pullAllData, 'OrganizeId', this.OrganizeId);
          Vue.set(this.pullAllData, 'City', this.responseData.City);
          Vue.set(this.pullAllData, 'years', this.years);
          Vue.set(this.pullAllData, 'MPID', this.responseData.MPID);
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
          Vue.set(this.pullAllData, 'ReviewStatus', this.ReviewStatus);
          Vue.set(this.pullAllData, 'SupervisorID', this.SupervisorID);
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
          this.judgeInputDisabled();
          this.readFromDraftBoxRequest();
          this.firstLoading.close();
        })
        .catch((error) => {
          console.log(error);
          this.firstLoading.close();
          news.ElErrorMessage(error);
        });
    },
    beforeUpload(file) {
      console.log('beforeUpload');
      console.log(file);
      const isText = file.type === 'application/vnd.ms-excel';
      const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      return (isText | isTextComputer);
    },

    handleExceed() {
      Message({
        message: '当前限制选择 1 个文件，请删除后继续上传',
        duration: 3000,
        type: 'error',
      });
    },

    uploadFile(item) {
      console.log(item);
      const fileObj = item.file;
      // FormData 对象
      const form = new FormData();
      // 文件对象
      form.append('File', fileObj);
      form.append('userID', this.userID);
      this.$api.yearUploadFile(form)
        .then((res) => {
          console.log(res);
          Message({
            message: res.data.isSuccess ? ('文件：' + fileObj.name + '上传成功') : (res.data.errorMessage),
            duration: 3000,
            type: res.data.isSuccess ? 'success' : 'error',
          });
          this.dialogExcelImport = false;
          setTimeout(() => {
            window.location.reload();
          }, 500);
        })
        .catch((errMsg) => {
          console.log(errMsg);
          Message({
            message: '文件：' + fileObj.name + '上传失败',
            duration: 3000,
            type: 'error',
          });
        });
    },

    commonSubmissionData(DZIndex) {
      this.firstLoadingCover('数据正在提交中，请稍后');
      const getSubmitData = this.tableSource;
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
        for (let j = 0; j < 13; j += 1) {
          if (dataClassName === 'F4' || dataClassName === 'G2') {
            submitObj[this.months[j]] = cal.remPercent(allInput[(j + 1)].value);
          } else {
            submitObj[this.months[j]] = cal.remSep(allInput[(j + 1)].value);
          }
        }
        submitListsArr.push(submitObj);
      }
      Vue.set(this.pullAllData, 'DZ', DZIndex);
      Vue.set(this.pullAllData, 'list', submitListsArr);
      console.log(this.pullAllData);
      this.$api.yearDataSubmission(this.pullAllData)
        .then((res) => {
          console.log(res);
          this.firstLoading.close();
          this.getAfterSubmissionAlertInfo(res.data.errorMessage, DZIndex);
        })
        .catch((error) => {
          console.log(error);
          this.firstLoading.close();
          news.ElErrorMessage(error);
        });
    },
    dataSubmissionRequest(DZIndex) {
      if (DZIndex === 0) {
        this.commonSubmissionData(DZIndex);
      } else if (DZIndex === 1) {
        MessageBox.confirm('此操作后所有的数据将锁定，无法再修改，若数据只是暂时保存，请点击保存草稿！', '提示', {
          confirmButtonText: '继续提交数据',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.commonSubmissionData(DZIndex);
        }).catch(() => {
          Message({
            message: '已经取消数据提交',
            type: 'info',
          });
          this.loadingCover.close();
        });
      }
    },

    readFromDraftBoxRequest() {
      this.firstLoadingCover('正在读取草稿箱数据，请稍后...');
      this.$api.yearLoadingData({
        Pr0139: this.Pr0139,
        years: this.years,
        City: this.City,
      }).then((response) => {
        this.firstLoading.close();
        this.DraftData = JSON.parse(response.data);
        console.log(this.DraftData);
        if (this.DraftData.length > 0) {
          this.ReviewOrRejectMPID = this.DraftData[0].MPID;
        }
        this.DraftData.forEach((item) => {
          const allInputEl = document.querySelectorAll('tr.' + item.className + '>td>input');
          for (let i = 0; i < 13; i += 1) {
            if (item.className === 'F4' || item.className === 'G2') {
              allInputEl[(i + 1)].value = cal.addPercent(item[this.months[i]].toFixed(2));
            } else {
              allInputEl[(i + 1)].value = Math.round(item[this.months[i]]).toLocaleString();
              if (item.className === 'F5') {
                this.SigningRatio['SigningRatio' + (i + 1)] = item[this.months[i]];
              }
            }
          }
        });
      }).catch((msg) => {
        console.log(msg);
        news.ElErrorMessage(msg);
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
        this.oneToTwelveSum();
      }
    },
    autoFillTwelveMonthData(index, className) {
      const currentInputValue = document.querySelector('table.commonTable .' + className + '>td:nth-child(' + index + ') input').value;
      const currentLineTr = document.querySelectorAll('table.commonTable .' + className + '>td>input');
      for (let i = 1; i < 13; i += 1) {
        currentLineTr[i].value = currentInputValue;
      }
      this.isInputValEmpty = false;
    },

    AllMonthsAutomaticCalculation() {
      for (let index = 3; index < 15; index += 1) {
        cal.allTableCalculation(index);
      }
    },

    currentMonthAutomaticCalculation(index) {
      if (index % 3 === 0) {
        for (let i = 0; i < 3; i += 1) {
          cal.allTableCalculation(index + i);
        }
      }
      if ((index - 1) % 3 === 0) {
        for (let i = -1; i < 2; i += 1) {
          cal.allTableCalculation(index + i);
        }
      }
      if ((index - 2) % 3 === 0) {
        for (let i = -2; i < 1; i += 1) {
          cal.allTableCalculation(index + i);
        }
      }
    },

    commonEvent(i, className, event) {
      let currentEl;
      if (event !== '') {
        currentEl = event.target;
      }
      console.log(this.SigningRatio);
      cal.whereUse('yearIndex');
      cal.getCity(this.City);
      cal.judgeDepartment(this.Pr0111);
      cal.getVueSigningRatio(this.SigningRatio);
      if (className !== 'F1' || (className === 'F1' && this.Pr0111 === 'A2')) {
        currentEl.value = Math.round(Number(currentEl.value)).toLocaleString();
        if (this.isInputValEmpty) {
          this.autoFillTwelveMonthData(i, className);
          this.AllMonthsAutomaticCalculation();
        } else {
          this.currentMonthAutomaticCalculation(i);
        }
      } else {
        this.currentMonthAutomaticCalculation(i);
      }
      this.oneToTwelveSum();
      if (event !== '') {
        currentEl.blur();
      }
    },

    AutomaticCalculation(i, className, event) {
      if (className !== 'F1') {
        if (!/^-?[0-9]+([.]{1}[0-9]+){0,1}$/.test(event.target.value)) {
          Message({
            message: '请输入有效数字!',
            duration: 1000,
            type: 'warning',
          });
          event.target.value = '';
          event.target.focus();
        } else {
          this.commonEvent(i, className, event);
        }
      } else {
        this.commonEvent(i, className, event);
      }
    },

    judgeInputDisabled() {
      if (this.fromWhichBtn === '0') {
        this.showReviewAndReject = false;
        this.withdraw = this.ReviewStatus === '1';
        this.showDraftAndSubmit = this.ReviewStatus === '' || this.ReviewStatus === '0' || this.ReviewStatus === '3';
        this.deleteBtnDisabled = this.ReviewStatus === '1' || this.ReviewStatus === '2';
        this.inputDisabled = this.ReviewStatus === '1' || this.ReviewStatus === '2';
      } else if (this.fromWhichBtn === '1' && this.userID !== this.CreateByUser) {
        this.deleteBtnDisabled = true;
        this.withdraw = false;
        this.showDraftAndSubmit = false;
        this.inputDisabled = true;
        if (process.env.VUE_APP_ISOPENAUTHORITY === '0') {
          this.showReviewAndReject = this.ReviewStatus === '1' && Number(this.viewEditorYear) === (new Date().getFullYear() + 1) && this.userID === this.SupervisorID;
        } else if (process.env.VUE_APP_ISOPENAUTHORITY === '1') {
          this.showReviewAndReject = this.ReviewStatus === '1' && this.userID === this.SupervisorID;
        }
      } else if (this.fromWhichBtn === '1' && this.userID === this.CreateByUser) {
        this.showReviewAndReject = false;
        if (process.env.VUE_APP_ISOPENAUTHORITY === '0') {
          this.withdraw = this.ReviewStatus === '1' && Number(this.viewEditorYear) === (new Date().getFullYear() + 1);
          this.showDraftAndSubmit = (this.ReviewStatus === '' || this.ReviewStatus === '0' || this.ReviewStatus === '3') && Number(this.viewEditorYear) === (new Date().getFullYear() + 1);
          this.deleteBtnDisabled = (!(this.ReviewStatus !== '1' && this.ReviewStatus !== '2')) && Number(this.viewEditorYear) === (new Date().getFullYear() + 1);
          this.inputDisabled = (!(this.ReviewStatus !== '1' && this.ReviewStatus !== '2')) && Number(this.viewEditorYear) === (new Date().getFullYear() + 1);
        }
        if (process.env.VUE_APP_ISOPENAUTHORITY === '1') {
          this.showDraftAndSubmit = this.ReviewStatus === '' || this.ReviewStatus === '0' || this.ReviewStatus === '3';
          this.withdraw = this.ReviewStatus === '1';
          this.deleteBtnDisabled = !(this.ReviewStatus !== '1' && this.ReviewStatus !== '2');
          this.inputDisabled = !(this.ReviewStatus !== '1' && this.ReviewStatus !== '2');
        }
      }
    },

    ReviewOrReject(index) {
      let selectedIndex;
      let message;
      if (index === 2) {
        selectedIndex = '审核';
        message = '您已经审核通过!';
      }
      if (index === 3) {
        selectedIndex = '驳回';
        message = '您已经驳回了';
      }
      if (index === 4) {
        selectedIndex = '撤回';
        message = '您已经撤回了';
      }
      MessageBox.confirm('您确认进行' + selectedIndex + '操作,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api.queryAndAddedQuery({
          MPID: this.ReviewOrRejectMPID,
          status: index,
          User: this.userID,
          IsYM: 0,
        }).then((res) => {
          console.log(res);
          Message({
            message,
            type: 'info',
            duration: 1000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }).catch((errMsg) => {
          console.log(errMsg);
          news.ElErrorMessage(errMsg);
        });
      }).catch(() => {
        Message({
          message: '已经取消操作',
          type: 'info',
          duration: 1000,
        });
      });
    },

    exportAllData() {
      console.log(this.exportUrl + '?MPID=' + this.ReviewOrRejectMPID);
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
  mounted() {
    console.log(process.env);
    if (process.env.VUE_APP_ISFIXEDYEAR === '1') {
      this.years = Number(process.env.VUE_APP_SCHEDULEDYEAR);
    }
    if (process.env.VUE_APP_ISFIXEDYEAR === '0') {
      this.years = new Date().getFullYear() + 1;
    }
    this.getBaseInfo();
    this.firstLoadingRequest();
  },
};

</script>
<style lang="less" scoped>
  .table-container{
    padding: 0 15px;
    h2{
      text-align: center;
    }
    .repeat-table-container{
      margin-top: 20px;
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
  .commonTable tr>th{
    width: 6.1%;
  }
  .commonTable tr>th:nth-child(1) {
    width: 8% !important;
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
  .hide-zero{
    display: none;
  }
</style>
<style lang="less">
  .upload-excel{
    text-align: center;
    .el-upload.el-upload--text{
      margin:auto;
    }
    .el-upload__tip,.el-upload-list{
      width: 360px;
      margin:10px auto 0;
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
</style>
