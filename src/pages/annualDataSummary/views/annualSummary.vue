<template>
  <div>
    <div class="year-summary-container">
      <h2>阿米巴{{years}}年年度汇总表</h2>
      <div class="submitBtn" v-if="submitBtnShow">
        <div class="top-left">
          {{`${yearStoreName}${years}年年度汇总表`}}
        </div>
        <div class="top-right">
          <el-button type="primary"
                     @click="dataSubmissionAndReview('1')"
                     v-if="showDraftAndSubmit"
          >数据提交</el-button>
          <el-button type="success"
                     icon="el-icon-success"
                     v-if="showReviewAndReject"
                     @click="dataSubmissionAndReview('2')"
          >审核通过</el-button>
          <el-button type="danger"
                     icon="el-icon-error"
                     v-if="showReviewAndReject"
                     @click="dataSubmissionAndReview('3')"
          >驳回</el-button>
          <el-button type="warning"
                     @click="hideSubjectWithZero"
          >{{hideZero}}</el-button>
          <el-button type="info" v-if="withdraw" @click="dataSubmissionAndReview('4')">撤回</el-button>
          <el-button type="success"
                     plain
                     @click="exportAllData"
                     v-if="true"
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
              <th  v-for="n in 12" :key="n">{{n}}月</th>
              <th>合计</th>
            </tr>
            </thead>
            <tbody>
            <tr  v-for="(item, i) in tableData"
                 :key="i"
                 :class="getForClassName(item.className)">
              <td>{{item.Name}}</td>
              <td v-for="n in 13"
                  :key="n">
                <!--执行顺序 onChange > onBlur-->
                <input type="text"
                       :readonly="true"
                >
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="this.tableSource === null" style="text-align: center;font-weight: bold;">暂无数据</div>
    </div>
    <iframe src="" frameborder="0" id="exportIframe" ref="exportIframe"></iframe>
  </div>
</template>

<script>
import Vue from 'vue';
import { MessageBox, Message } from 'element-ui';
import api from '@/http/index';
import cal from '@/assets/js/comCalculation';
import news from '@/assets/js/notification';
import '@/assets/css/statisticalReport.css';

Vue.component(MessageBox.name, MessageBox);
Vue.use(api);

export default {
  name: 'annualSummary',
  data() {
    return {
      userID: '',
      exportUrl: process.env.VUE_APP_APIRELEASEADDRESS + '/AnnualSummaryExport',
      years: '',
      submitBtnShow: false,
      draft: '',
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
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Total'],
      showReviewAndReject: false,
      showDraftAndSubmit: true,
      hideZero: '隐藏整行为0的数据',
      CreateByUser: '',
      Review: '',
      SupervisorID: '',
      OrganizeId: '',
      withdraw: false,
    };
  },
  methods: {
    getForClassName(el) {
      return el;
    },
    toggleSubject(event) {
      cal.toggleSubject(event);
    },
    dataSubmissionAndReview(index) {
      this.firstLoadingCover('Loading...');
      let selectedIndex;
      if (index === '1') {
        selectedIndex = '数据提交';
      }
      if (index === '2') {
        selectedIndex = '审核';
      }
      if (index === '3') {
        selectedIndex = '驳回';
      }
      if (index === '4') {
        selectedIndex = '撤回';
      }
      MessageBox.confirm('您确认进行' + selectedIndex + '操作,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api.summaryData({
          // userID: this.userID,
          userID: this.CreateByUser,
          SupervisorID: this.SupervisorID,
          years: this.years,
          Review: index,
        })
          .then((res) => {
            console.log(res);
            this.firstLoadingCover().close();
            Message({
              message: res.data.message,
              type: res.data.result === true ? 'success' : 'error',
            });
            if (res.data.result) {
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          })
          .catch((errMsg) => {
            console.log(errMsg);
            this.firstLoadingCover().close();
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
    firstLoadingCover(text) {
      return this.$loading({
        lock: true,
        text,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'el-loading-info',
      });
    },
    annualSummaryFirstRequest() {
      this.firstLoadingCover('Loading');
      this.OrganizeId = decodeURI(news.getQueryVariable('OrganizeId'));
      this.years = decodeURI(news.getQueryVariable('years'));
      this.CreateByUser = decodeURI(news.getQueryVariable('CreateByUser'));
      this.userID = decodeURI(sessionStorage.getItem('userID'));
      const params = {
        OrganizeId: this.OrganizeId,
        years: this.years,
      };
      console.log(params);
      this.$api.queryAndAddedQuery(params)
        .then((msg) => {
          console.log(JSON.parse(msg.data));
          this.responseData = JSON.parse(msg.data);
          this.SupervisorID = JSON.parse(msg.data).SupervisorID;
          this.Review = JSON.parse(msg.data).Review;
          this.IsComplete = JSON.parse(msg.data).IsComplete;
          this.tableSource = JSON.parse(msg.data).list;
          if (this.tableSource !== null) {
            this.injectTableSourceData();
            for (let i = 0; i < 8; i += 1) {
              this.tableDataInject.push(this['tableDataSource' + i]);
            }
            this.submitBtnShow = true;
            setTimeout(() => {
              this.injectTableReadonlyData(this.tableSource);
            }, 10);
          }
          this.authorityJudgment();
          this.firstLoadingCover('Loading').close();
        })
        .catch((errMsg) => {
          console.log(errMsg);
          this.firstLoadingCover('Loading').close();
          news.ElErrorMessage(errMsg);
        });
    },
    injectTableReadonlyData(data) {
      console.log(data);
      data.forEach((item) => {
        const allInputEl = document.querySelectorAll('div.year-summary-container tr.' + item.className + '>td>input');
        for (let i = 0; i < 13; i += 1) {
          if (item.className === 'F4') {
            if (cal.remSep(document.querySelectorAll('div.year-summary-container tr.A6>td>input')[i].value) !== 0) {
              allInputEl[i].value = cal.addPercent(cal.remSep(document.querySelectorAll('div.year-summary-container tr.F3>td>input')[i].value) / cal.remSep(document.querySelectorAll('div.year-summary-container tr.A6>td>input')[i].value));
            }
          } else if (item.className === 'G2') {
            if (cal.remSep(document.querySelectorAll('div.year-summary-container tr.G0>td>input')[i].value) !== 0) {
              allInputEl[i].value = cal.addPercent(cal.remSep(document.querySelectorAll('div.year-summary-container tr.G1>td>input')[i].value) / cal.remSep(document.querySelectorAll('div.year-summary-container tr.G0>td>input')[i].value));
            }
          } else if (item.className === 'H1') {
            if (cal.remSep(document.querySelectorAll('div.year-summary-container tr.H0>td>input')[i].value) !== 0) {
              allInputEl[i].value = Math.round(cal.remSep(document.querySelectorAll('div.year-summary-container tr.F3>td>input')[i].value) / cal.remSep(document.querySelectorAll('div.year-summary-container tr.H0>td>input')[i].value));
            }
          } else {
            allInputEl[i].value = item[this.months[i]].toLocaleString();
          }
        }
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
        January: data.January,
        February: data.February,
        March: data.March,
        April: data.April,
        May: data.May,
        June: data.June,
        July: data.July,
        August: data.August,
        September: data.September,
        October: data.October,
        November: data.November,
        December: data.December,
        Total: data.Total,
      };
      tableDataSource.push(obj);
    },
    hideSubjectWithZero() {
      if (this.hideZero === '隐藏整行为0的数据') {
        this.hideZero = '显示所有数据';
        this.tableSource.forEach((item) => {
          const allInputEl = document.querySelectorAll('table.KMTable1.commonTable tr.' + item.className + ' input');
          let isZero;
          for (let i = 0; i < 12; i += 1) {
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
    exportAllData() {
      this.$refs.exportIframe.setAttribute('src', this.exportUrl + '?OrganizeId=' + this.OrganizeId);
    },
    authorityJudgment() {
      console.log(this.userID);
      console.log(this.SupervisorID);
      // TODO:确认上下级是否是同一个userID;
      if (process.env.VUE_APP_ISOPENAUTHORITY === '0') {
        this.showDraftAndSubmit = this.userID === this.CreateByUser && this.IsComplete === true && (this.Review === '0' || this.Review === '3') && Number(this.years) === (new Date().getFullYear() + 1);
        this.showReviewAndReject = this.userID === this.SupervisorID && this.Review === '1' && Number(this.years) === (new Date().getFullYear() + 1);
        this.withdraw = this.Review === '1' && this.IsComplete === true && this.userID === this.CreateByUser && Number(this.years) === (new Date().getFullYear() + 1);
      }
      if (process.env.VUE_APP_ISOPENAUTHORITY === '1') {
        this.showReviewAndReject = this.userID === this.SupervisorID && this.Review === '1';
        this.showDraftAndSubmit = this.userID === this.CreateByUser && this.IsComplete === true && (this.Review === '0' || this.Review === '3');
        this.withdraw = this.Review === '1' && this.IsComplete === true && this.userID === this.CreateByUser;
        // note:方便测试，下面两行为测试代码,上两行为正式环境代码；
        // this.showDraftAndSubmit = this.userID === this.CreateByUser && (this.Review === '0' || this.Review === '3');
        // this.withdraw = this.Review === '1' && this.userID === this.CreateByUser;
      }
    },
  },
  computed: {
    yearStoreName() {
      return sessionStorage.getItem('yearStoreName').slice(0, -3);
    },
  },
  mounted() {
    this.annualSummaryFirstRequest();
    console.log(process.env.NODE_ENV);
    console.log(process.env);
  },
};

</script>
<style lang="less" scoped>
  .year-summary-container{
    padding: 0 15px;
    h2{
      text-align: center;
    }
    .repeat-table-container{
      margin-top: 20px;
    }
    table{
      border-collapse: collapse;
      width: 100%;
    }
  }
  .commonTable tr>th{
    width: 6.1% !important;
  }
  .commonTable tr>th:nth-child(1){
    width: 8% !important;
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
  .hide-zero{
    display: none;
  }
  @page {
    size: A4;
    margin: 0;
    padding: 0;
  }
  @media print {
    html,body{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      width: 210mm;
      height: 296mm;
    }
    .year-summary-container{
      margin: 0 2% 0 1%;
    }
  }
</style>
<style lang="less">
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
    tbody{
      tr{
        height: 40px;
      }
    }
  }
</style>
