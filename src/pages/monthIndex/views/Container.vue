<template>
  <div>
    <div class="table-container">
      <h1>阿米巴报表月度核算系统</h1>
      <div class="submitBtn" v-if="submitBtnShow">
        <div class="top-left">
          {{responseData.UnitName}}{{years}}年年度预定计划
        </div>
        <div class="top-right">
          <el-button type="primary">保存到草稿箱</el-button>
          <el-button type="success">数据提交</el-button>
        </div>
      </div>
      <div v-for="(tableData, index) in tableDataInject"
           :key="index"
           class="repeat-table-container">
        <div v-if="tableData.length>0">
          <table class="KMTable1 commonTable" border="1">
            <thead>
            <tr>
              <th>科目</th>
              <th>历史数据</th>
              <th>某个月预定</th>
              <th>某个月实际</th>
              <th>预定比(%)</th>
              <th>8月预定实际差异</th>
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
              <td><input type="number" readonly></td>
              <td v-for="n in 7" :key="n">
                <input type="number"
                       :readonly="item.ReadOnly === 1?true:false"
                >
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Container',
  data() {
    return {
      getUrl: 'http://10.100.250.153:99/api/Subject',
      userID: '{8F5FF78A-E0C0-40EE-91ED-88B32A247DE9}',
      years: new Date().getFullYear() + 1,
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
      submitBtnShow: true,
    };
  },
  methods: {
    getForClassName(el) {
      return el;
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
        this.tableSource = JSON.parse(res.data).list;
        this.injectTableSourceData();
        for (let i = 0; i < 8; i += 1) {
          this.tableDataInject.push(this['tableDataSource' + i]);
        }
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
  },
  created() {
    this.firstLoadingRequest();
  },
};
</script>

<style lang="less">
  .table-container{
    h1{
      text-align: center;
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
  table.KMTable1.commonTable{
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    text-align: center;
    th{
      width: 11% !important;
    }
  }
</style>
