<template>
  <div>
    <div class="year-summary-container">
      <h2>阿米巴{{years}}年年度汇总表</h2>
      <div class="submitBtn" v-if="submitBtnShow">
        <div class="top-left">
          <!-- TODO:fixedYear更改回来 -->
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
              <td v-for="n in 12"
                  :key="n">
                <!--执行顺序 onChange > onBlur-->
                <input type="text"
                       :readonly="true"
                       :value="addSep(item, n)"
                >
              </td>
              <td>
                <input type="text" readonly :value="totalAddSep(item)">
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="this.tableSource === null">暂无数据</div>
    </div>
    <iframe src="" frameborder="0" id="exportIframe" ref="exportIframe"></iframe>
  </div>
</template>

<script>
import Vue from 'vue';
import { Message } from 'element-ui';
import api from '@/http/index';
import cal from '@/assets/js/comCalculation';
import news from '@/assets/js/notification';
import '@/assets/css/statisticalReport.css';

Vue.use(api);

export default {
  name: 'annualSummary',
  data() {
    return {
      userID: '',
      // userID: '{85811A95-BB15-4914-8926-82E88F5E6E78}', // 权限大
      // userID: '{8F5FF78A-E0C0-40EE-91ED-88B32A247DE9}', // 权限小
      /* TODO:地址要改成正式的环境 */
      exportUrl: process.env.VUE_APP_APIRELEASEADDRESS + '/AnnualSummaryExport',
      years: '',
      submitBtnShow: false,
      draft: '',
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
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      showReviewAndReject: false,
      showDraftAndSubmit: true,
      hideZero: '隐藏整行为0的数据',
      CreateByUser: '',
      Review: '',
      SupervisorID: '',
      OrganizeId: '',
    };
  },
  methods: {
    getForClassName(el) {
      return el;
    },
    addSep(item, n) {
      if (item.className === 'F4' || item.className === 'G2') {
        return cal.addPercent(item[this.months[n - 1]]);
      }
      return Math.round(item[this.months[n - 1]]).toLocaleString();
    },
    totalAddSep(el) {
      if (el.className === 'F4' || el.className === 'G2') {
        return cal.addPercent(el.Total);
      }
      return Math.round(el.Total).toLocaleString();
    },
    toggleSubject(event) {
      cal.toggleSubject(event);
    },
    dataSubmissionAndReview(index) {
      if (index === '1') {
        this.firstLoadingCover('数据正在提交，请稍候...');
      }
      this.$api.summaryData({
        userID: this.userID,
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
        })
        .catch((errMsg) => {
          console.log(errMsg);
          this.firstLoadingCover().close();
          news.ElErrorMessage(errMsg);
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
          let sumData = 0;
          for (let i = 1; i < 13; i += 1) {
            sumData = Number(allInputEl[i].value) + sumData;
          }
          if ((sumData === 0 || sumData === 0.0 || sumData === 0.00) && (allInputEl[0].value === '0' || allInputEl[0].value === '0.0' || allInputEl[0].value === '0.00' || allInputEl[0].value === '')) {
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
      }
      if (process.env.VUE_APP_ISOPENAUTHORITY === '1') {
        this.showDraftAndSubmit = this.userID === this.CreateByUser && this.IsComplete === true && (this.Review === '0' || this.Review === '3');
        this.showReviewAndReject = this.userID === this.SupervisorID && this.Review === '1';
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
