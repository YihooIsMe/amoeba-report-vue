<template>
  <div class="monthly-summary-container">
    <h2>月度汇总表</h2>
    <div class="monthly-summary-btn" v-if="IsShowBtn">
      <div class="top-left">
        {{`${storeName}${years}年${Month}月汇总表`}}
      </div>
      <div class="top-right">
        <el-button type="primary"
                   @click="dataSubmissionAndReview('1')"
                   v-if="showDraftAndSubmit"
        >数据提交</el-button>
        <el-button
          type="success"
          icon="el-icon-success"
          @click="dataSubmissionAndReview('2')"
          v-if="showReviewAndReject"
        >审核通过</el-button>
        <el-button
          type="danger"
          icon="el-icon-error"
          @click="dataSubmissionAndReview('3')"
          v-if="showReviewAndReject"
        >驳回</el-button>
        <el-button
          type="primary"
          plain
          @click="hideSubjectWithZero"
        >{{hideZero}}</el-button>
        <el-button type="warning" v-if="true" @click="monthlySummaryData">Excel导出</el-button>
      </div>
    </div>
    <div v-for="(tableData, index) in tableDataInject"
         :key="index"
         class="repeat-table-container">
      <div v-if="tableData.length>0">
        <table class="KMTable1 commonTable monthly-summary" border="1">
          <thead>
          <tr>
            <th><i class="el-icon-arrow-down" @click="toggleSubject($event)" id="toggle-icon">科目</i></th>
            <th>{{Month}}月预定</th>
            <th>{{Month}}月实际</th>
            <th>预定比(%)</th>
            <th>{{Month}}月预定实际差异</th>
            <th>MP</th>
            <th>MP比</th>
            <th>累计MP</th>
            <th>累计实际</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in tableData"
              :key="i" :class="getClassName(item.className)">
            <td>{{item.Name}}</td>
            <td v-for="n in 8" :key="n">
              <input type="text"
                     :readonly="true"
                     :value="item[rowSort[n-1]]"
              >
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="tableDataList === null" style="text-align: center;font-weight: bold">暂无数据</div>
    <iframe src="" frameborder="0" id="exportIframe" ref="exportIframe"></iframe>
  </div>
</template>

<script>
import Vue from 'vue';
import { MessageBox, Loading, Message } from 'element-ui';
import cal from '@/assets/js/comCalculation';
import news from '@/assets/js/notification';
import api from '@/http/index';

Vue.component(MessageBox.name, MessageBox);
Vue.use(Loading);
Vue.use(api);

export default {
  name: 'monthlySummary',
  data() {
    return {
      userID: '',
      // userID: '{85811A95-BB15-4914-8926-82E88F5E6E78}', // 瑞虹一店;
      // userID: '{8F5FF78A-E0C0-40EE-91ED-88B32A247DE9}', // 咨询部;
      exportUrl: process.env.VUE_APP_APIRELEASEADDRESS + '/MonthSummaryDownLoad',
      tableDataSource0: [], // Type类型为0的数据;
      tableDataSource1: [], // Type类型为1的数据;
      tableDataSource2: [], // Type类型为2的数据;
      tableDataSource3: [], // Type类型为3的数据;
      tableDataSource4: [], // Type类型为4的数据;
      tableDataSource5: [], // Type类型为5的数据;
      tableDataSource6: [], // Type类型为6的数据;
      tableDataSource7: [], // Type类型为7的数据;
      tableDataInject: [],
      tableDataList: '',
      rowSort: ['EstimatedAmount', 'ActualAmount', 'PredeterminedRatio', 'Difference', 'MP', 'MPRatio', 'GrandTotalMP', 'GrandTotalActualMP'],
      hideZero: '隐藏整行为0的数据',
      years: '',
      Month: '',
      OrganizeId: '',
      company: '',
      Review: '',
      CreateByUser: '',
      showDraftAndSubmit: '',
      showReviewAndReject: '',
      IsShowBtn: false,
    };
  },
  methods: {
    toggleSubject(event) {
      cal.toggleSubject(event);
    },
    getClassName(name) {
      return name;
    },
    hideSubjectWithZero() {
      if (this.hideZero === '隐藏整行为0的数据') {
        this.hideZero = '显示所有数据';
        this.tableDataList.forEach((item) => {
          const allInputEl = document.querySelectorAll('table.monthly-summary tr.' + item.className + ' input');
          let sumData = 0;
          for (let i = 0; i < 8; i += 1) {
            sumData = cal.remSep(allInputEl[i].value) + sumData;
          }
          if (sumData === 0 || sumData === 0.0 || sumData === 0.00) {
            document.querySelector('table.monthly-summary tr.' + item.className).classList.add('hide-zero');
          }
        });
      } else {
        this.hideZero = '隐藏整行为0的数据';
        const allEl = document.querySelectorAll('table.monthly-summary tr');
        for (let i = 0; i < allEl.length; i += 1) {
          allEl[i].classList.remove('hide-zero');
        }
      }
    },
    loadingCover() {
      return this.$loading({
        lock: true,
        text: 'Loading....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    },
    monthlySummaryRequest() {
      this.userID = sessionStorage.getItem('userID');
      this.years = decodeURI(news.getQueryVariable('years'));
      this.Month = decodeURI(news.getQueryVariable('Month'));
      this.CreateByUser = decodeURI(news.getQueryVariable('CreateByUser'));
      const params = {
        OrganizeId: decodeURI(news.getQueryVariable('OrganizeId')),
        years: this.years,
        Month: this.Month,
        company: decodeURI(news.getQueryVariable('company')),
      };
      console.log(params);
      this.$api.queryAndAddedQuery(params).then((response) => {
        this.SupervisorID = JSON.parse(response.data).SupervisorID;
        this.OrganizeId = JSON.parse(response.data).OrganizeId;
        this.company = JSON.parse(response.data).Company;
        this.Review = JSON.parse(response.data).Review;
        this.IsComplete = JSON.parse(response.data).IsComplete;
        console.log(JSON.parse(response.data));
        this.tableDataList = JSON.parse(response.data).list;
        if (this.tableDataList !== null) {
          this.tableDataList.forEach((item) => {
            this.getTypeObj(this['tableDataSource' + item.Type], item);
          });
          for (let i = 0; i < 8; i += 1) {
            this.tableDataInject.push(this['tableDataSource' + i]);
          }
          this.IsShowBtn = true;
        }
        this.monthAuthorityJudge();
        this.loadingCover().close();
      }).catch((errMsg) => {
        console.log(errMsg);
        this.loadingCover().close();
        news.ElErrorMessage(errMsg);
      });
    },
    getTypeObj(tableDataSource, data) {
      const obj = {
        Name: data.Name,
        className: data.className,
        EstimatedAmount: data.EstimatedAmount,
        ActualAmount: data.ActualAmount,
        PredeterminedRatio: data.PredeterminedRatio,
        Difference: data.Difference,
        MP: data.MP,
        MPRatio: data.MPRatio,
        GrandTotalMP: data.GrandTotalMP,
        GrandTotalActualMP: data.GrandTotalActualMP,
      };
      tableDataSource.push(obj);
    },
    dataSubmissionAndReview(index) {
      this.loadingCover();
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
      MessageBox.confirm('您确认进行' + selectedIndex + '操作,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api.summaryData({
          userID: this.userID,
          SupervisorID: this.SupervisorID,
          years: this.years,
          month: this.Month,
          Review: index,
        })
          .then((res) => {
            console.log(res);
            this.loadingCover().close();
            Message({
              message: res.data.message,
              type: res.data.result === true ? 'success' : 'error',
            });
          })
          .catch((errMsg) => {
            console.log(errMsg);
            this.loadingCover().close();
            news.ElErrorMessage(errMsg);
          });
      })
        .catch(() => {
          Message({
            message: '已经取消操作',
            type: 'info',
            duration: 1000,
          });
        });
    },
    monthlySummaryData() {
      const params = {
        OrganizeId: this.OrganizeId,
        company: this.company,
        years: this.years,
        Month: this.Month,
      };
      console.log(params);
      this.$refs.exportIframe.setAttribute('src', this.exportUrl + '?OrganizeId=' + params.OrganizeId + '&company=' + params.company + '&years=' + params.years + '&Month=' + params.Month);
    },
    monthAuthorityJudge() {
      const year = news.yearAndMonthChange().year;
      const month = news.yearAndMonthChange().month;
      if (process.env.VUE_APP_ISOPENAUTHORITY === '0') {
        this.showReviewAndReject = this.Review === '1' && this.userID === this.SupervisorID && Number(this.Month) === month && Number(this.years) === year;
        this.showDraftAndSubmit = (this.Review === '0' || this.Review === '3') && this.IsComplete === true && this.userID === this.CreateByUser && Number(this.Month) === month && Number(this.years) === year;
      }
      if (process.env.VUE_APP_ISOPENAUTHORITY === '1') {
        this.showReviewAndReject = this.Review === '1' && this.userID === this.SupervisorID;
        this.showDraftAndSubmit = (this.Review === '0' || this.Review === '3') && this.IsComplete === true && this.userID === this.CreateByUser;
      }
    },
    interestRate(tar, molecule, denominator) {
      // tar 目标值
      // molecule 分子数值
      // Denominator 分母数值
      if (Number(document.querySelector('.monthly-summary-container table.monthly-summary tr.' + molecule + '>td:nth-child(2)>input').value) !== 0) {
        document.querySelector('.monthly-summary-container table.monthly-summary tr.' + tar + '>td:nth-child(2)>input').value = cal.addPercent(Number(document.querySelector('.monthly-summary-container table.monthly-summary tr.' + denominator + '>td:nth-child(2)>input').value) / Number(document.querySelector('.monthly-summary-container table.monthly-summary tr.' + molecule + '>td:nth-child(2)>input').value));
      }
    },
  },
  computed: {
    storeName() {
      return sessionStorage.getItem('Name').slice(0, -3);
    },
  },
  watch: {
    tableDataInject() {
      this.$nextTick(() => {
        // 由于后台数据处理的原因,这三条数据在前台单独处理;
        this.interestRate('F4', 'A6', 'F3');
        this.interestRate('G2', 'G0', 'G1');
        this.interestRate('H1', 'H0', 'F3');
      });
    },
  },
  mounted() {
    this.monthlySummaryRequest();
  },
  created() {
    this.loadingCover();
  },
};
</script>

<style lang="less" scoped>
  .monthly-summary-container{
    padding: 0;
    h2{
      text-align: center;
    }
    .monthly-summary-btn{
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
  }
  table.KMTable1.commonTable{
    margin-top: 20px;
    border-collapse: collapse;
    .F5{
      display: none;
    }
    th{
      width: 10% !important;
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
      input[readonly] {
        cursor: not-allowed;
        background: rgba(170, 170, 170, 0.41);
      }
    }
    td:first-child{
      padding-left: 10px;
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
  @page {
    size: A4;
    margin: 0;
    padding: 0;
  }
  @media print {
    html,body{
      box-sizing: border-box;
      width: 210mm;
      height: 296mm;
    }
    .monthly-summary-container{
      margin: 0 3% 0 1%;
    }
  }
</style>
<style lang="less" scoped>
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
  .toggle-subject,.hide-zero{
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
<style>
  iframe{
    height:0;
  }
</style>
