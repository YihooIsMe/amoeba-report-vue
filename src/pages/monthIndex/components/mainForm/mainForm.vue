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
            <th>8月实际</th>
            <th>9月预定</th>
            <th>9月实际</th>
            <th>预定比(%)</th>
            <th>9月预定实际差异</th>
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
            <td><input type="text" readonly></td>
            <td v-for="n in 7" :key="n">
              <input type="text"
                     :readonly="item.ReadOnly === 1?true:false"
              >
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'mainForm',
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
      }
    }
  }
  .red{
    color:red;
  }
  .mt10{
    margin-top: 10px;
  }
</style>
