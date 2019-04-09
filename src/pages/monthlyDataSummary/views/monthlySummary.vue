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
        <el-button type="info" v-if="withdraw" @click="dataSubmissionAndReview('4')">撤回</el-button>
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
            <th>预定比</th>
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
import summaryCal from '@/assets/js/summaryCalculation';
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
      exportUrl: process.env.VUE_APP_APIRELEASEADDRESS + '/TDownLoad',
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
      withdraw: false,
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
          let isZero;
          for (let i = 0; i < 8; i += 1) {
            if (parseFloat(allInputEl[i].value) !== 0 && allInputEl[i].value !== '') {
              isZero = false;
              break;
            } else {
              isZero = true;
            }
          }
          if (isZero) {
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
    injectTableData() {
      this.tableDataList.forEach((item) => {
        const allInputEl = document.querySelectorAll('table.monthly-summary tr.' + item.className + '>td>input');
        for (let i = 0; i < allInputEl.length; i += 1) {
          allInputEl[i].value = item[this.rowSort[i]];
        }
      });
    },
    loadingCover() {
      return this.$loading({
        lock: true,
        text: 'Loading....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    },
    // 月度汇总表计算逻辑;
    summaryCalculation() {
      const arrIndex = [2, 3, 6, 8, 9];
      arrIndex.forEach((item) => {
        summaryCal.currentColumnCalculation(item);
      });
      summaryCal.ratio(this.tableDataList, 'monthly-summary', 0, 1, 2);
      summaryCal.bookActualDiff(this.tableDataList, 'monthly-summary', 1, 0, 3);
      summaryCal.ratio(this.tableDataList, 'monthly-summary', 4, 1, 5);
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
          this.$nextTick(() => {
            this.injectTableData();
            this.summaryCalculation();
          });
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
      if (index === '4') {
        selectedIndex = '撤回';
      }
      MessageBox.confirm('您确认进行' + selectedIndex + '操作,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        console.log({
          // userID: this.userID,
          userID: this.CreateByUser,
          SupervisorID: this.SupervisorID,
          years: this.years,
          month: this.Month,
          Review: index,
        });
        this.$api.summaryData({
          userID: this.CreateByUser,
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
            if (res.data.result) {
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }
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
      this.loadingCover();
      const params = {
        OrganizeId: this.OrganizeId,
        company: this.company,
        years: this.years,
        Month: this.Month,
      };
      console.log(params);
      const SummaryMonthList = {};
      const SummaryMonthListArray = [];
      this.tableDataList.forEach((item) => {
        const allInputEl = document.querySelectorAll('table.monthly-summary tr.' + item.className + '>td>input');
        const obj = {};
        obj.Name = item.Name;
        const keyList = ['MonthData', 'TheMonthAmount', 'PredeterminedRatio', 'Difference', 'AnnualReservation', 'MPRatio', 'GrandTotalMP', 'GrandTotalActualMP'];
        keyList.forEach((el, i) => {
          obj[el] = allInputEl[i].value;
        });
        SummaryMonthListArray.push(obj);
      });
      SummaryMonthList.SummaryMonthList = SummaryMonthListArray;
      console.log(SummaryMonthList);
      this.$api.monthlySummaryExport(SummaryMonthList)
        .then((res) => {
          this.loadingCover().close();
          console.log(res.data);
          this.$refs.exportIframe.setAttribute('src', this.exportUrl + '?ID=' + res.data);
          // const blob = new Blob([res]);
          // const fileName = '月度汇总表';
          // const elink = document.createElement('a');
          // elink.download = fileName;
          // elink.style.display = 'none';
          // elink.href = URL.createObjectURL(blob);
          // document.body.appendChild(elink);
          // elink.click();
          // URL.revokeObjectURL(elink.href); // 释放URL 对象
          // document.body.removeChild(elink);

          // const blob = new Blob([res]);
          // const fileName = '统计.xlsx';
          // const elink = document.createElement('a');
          // elink.download = fileName;
          // elink.style.display = 'none';
          // elink.href = URL.createObjectURL(blob);
          // document.body.appendChild(elink);
          // elink.click();
          // URL.revokeObjectURL(elink.href); // 释放URL 对象
          // document.body.removeChild(elink);

          // this.$refs.exportIframe.setAttribute('src', this.exportUrl);
          // this.$api.monthlySummaryDown({
          //   OrganizeId: params.OrganizeId,
          //   company: params.company,
          //   years: params.years,
          //   Month: params.Month,
          // })
          //   .then((res) => {
          //     console.log(res);
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((errMsg) => {
          this.loadingCover().close();
          news.ElErrorMessage(errMsg);
        });
    },
    monthAuthorityJudge() {
      // ReviewStatus = '' 未填写
      // ReviewStatus = '0' 填写中
      // ReviewStatus = '1' 待审核
      // ReviewStatus = '2' 审核通过
      // ReviewStatus = '3' 驳回
      const year = news.yearAndMonthChange().year;
      const month = news.yearAndMonthChange().month;
      if (process.env.VUE_APP_ISOPENAUTHORITY === '0') {
        this.showReviewAndReject = this.Review === '1' && this.userID === this.SupervisorID && Number(this.Month) === month && Number(this.years) === year;
        this.showDraftAndSubmit = (this.Review === '0' || this.Review === '3') && this.IsComplete === true && this.userID === this.CreateByUser && Number(this.Month) === month && Number(this.years) === year;
        this.withdraw = this.Review === '1' && this.IsComplete === true && this.userID === this.CreateByUser && Number(this.Month) === month && Number(this.years) === year;
      }
      if (process.env.VUE_APP_ISOPENAUTHORITY === '1') {
        this.showReviewAndReject = this.Review === '1' && this.userID === this.SupervisorID;
        this.showDraftAndSubmit = (this.Review === '0' || this.Review === '3') && this.IsComplete === true && this.userID === this.CreateByUser;
        this.withdraw = this.Review === '1' && this.IsComplete === true && this.userID === this.CreateByUser;
        // TODO:note--方便测试，下面两行为测试代码,上两行为正式环境代码；
        // this.showDraftAndSubmit = (this.Review === '0' || this.Review === '3') && this.userID === this.CreateByUser;
        // this.withdraw = this.Review === '1' && this.userID === this.CreateByUser;
      }
    },
  },
  computed: {
    storeName() {
      return sessionStorage.getItem('Name').slice(0, -3);
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
    width: 100%;
    .F5{
      display: none;
    }
    tr{
      box-sizing: border-box;
      th{
        height:40px;
        width: 10%;
      }
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
      td{
        box-sizing: border-box;
        height:40px;
        width: 10%;
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
      td:first-child,th:first-child{
        padding-left: 10px;
        text-align: center;
        min-width: 140px;
      }
    }
    /*兼容firefox下td下的input有缝隙*/
    tr.E4,tr.H0{
      td{
        height: 45px;
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
<style>
  iframe{
    height:0;
  }
</style>
