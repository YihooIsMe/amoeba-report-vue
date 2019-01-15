<template>
    <div class="month-query-container">
      <h1>核算表系统月度计划</h1>
      <div class="department">
      <ul class="department-list">
        <li>部门:</li>
        <li v-if="threeAreas.length>0">
          <select v-model="Pr0132" @change="getBusinessOfficeRequest(1)" :disabled="selectDisabled[0]">
            <option value=''>请选择</option>
            <option v-for="(item, index) in threeAreas" :key="index" :value="item.F_Id">{{item.F_FullName}}</option>
          </select>
        </li>
        <li v-if="businessOffice.length>0">
          <select v-model="secondSelected" @change="getUnitDataRequest(1)" :disabled="selectDisabled[1]">
            <option value=''>全部</option>
            <option v-for="(item, index) in businessOffice" :key="index" :value="item.F_Id">{{item.F_FullName}}</option>
          </select>
        </li>
        <li v-if="unitData.length>0">
          <select v-model="thirdSelected" @change="getFourthSelectStoreRequest(1)" :disabled="selectDisabled[2]">
            <option value=''>全部</option>
            <option v-for="(item, index) in unitData" :key="index" :value="item.F_Id">{{item.F_FullName}}</option>
          </select>
        </li>
        <li v-if="fourthSelectStore.length>0">
          <select v-model="fourthSelectStoreSelected" :disabled="selectDisabled[3]">
            <option value=''>全部</option>
            <option v-for="(item, index) in fourthSelectStore" :key="index" :value="item.F_Id">{{item.F_FullName}}</option>
          </select>
        </li>
      </ul>
        <ul class="year-select">
          <li>年月:</li>
          <li>
            <select v-model="yearSelected">
              <option v-for="n in 30" :key="n">{{2008 + n}}</option>
            </select>
            年
          </li>
          <li>
            <select class="month-select"  v-model="monthSelected">
              <option v-for="n in 12" :key="n">{{n}}</option>
            </select>
            月
          </li>
        </ul>
        <div class="button-container">
          <el-button type="primary" @click="auditTableQueryRequest">查询</el-button>
          <el-button type="success" @click="linkToIndex">新增</el-button>
        </div>
      </div>
      <div v-if="queryTableAllData.length>0">
        <table class="show-query-table" border="1">
          <thead>
          <tr>
            <th>年度/月度</th>
            <th>部门</th>
            <th>主管</th>
            <th>状态</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in queryTableAllData" :key="index">
            <td>{{copyYearSelected}}/{{copyMonthSelected}}</td>
            <td>{{item.F_FullName}}</td>
            <td>{{item.F_RealName}}</td>
            <td>{{item.Status}}</td>
            <td>{{item.Time}}</td>
            <td><el-button type="primary" icon="el-icon-edit" size="small" :disabled="item.MPID == '0'?true:false" @click="viewEditor(item)">查看编辑</el-button></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { MessageBox } from 'element-ui';
import VueCookie from 'vue-cookie';
import api from '@/http/index';

Vue.component(MessageBox.name, MessageBox);
Vue.use(VueCookie);
Vue.use(api);

export default {
  name: 'QueryContainer',
  data() {
    return {
      // userID: '{8F5FF78A-E0C0-40EE-91ED-88B32A247DE9}',
      // userID: '{85811A95-BB15-4914-8926-82E88F5E6E78}',
      userID: '',
      organizationListData: [],
      threeAreas: [
        { F_Id: '{19BDD92C-55A5-4284-A917-5BCC99FAC4E1}', F_FullName: '上海信义' },
        { F_Id: '{A138EF0C-7CA1-4288-8DCF-24C9583C4EB6}', F_FullName: '苏州信义' },
        { F_Id: '{C278D9F0-20A7-4A0D-8AFE-1E6FF35DF4EE}', F_FullName: '浙江信义' },
      ],
      businessOffice: [],
      unitData: [],
      fourthSelectStore: [],
      Pr0132: '',
      ParentId: '',
      District: '',
      OrganizeId: '',
      FourthParentId: '',
      yearSelected: (new Date().getFullYear()).toString(),
      monthSelected: (new Date().getMonth() + 2).toString(),
      copyYearSelected: '',
      copyMonthSelected: '',
      // Permission: 'S',
      Permission: '',
      selectDisabled: ['', '', '', ''],
      querySelectorArr: [],
      page: 1,
      rows: 50,
      queryTableAllData: '',
      otherParentId: '',
      secondSelected: '',
      thirdSelected: '',
      fourthSelectStoreSelected: '',
    };
  },
  methods: {
    getUserRequest(permission) {
      this.$api.queryAndAddedUserInfo({ userID: this.userID })
        .then((res) => {
          console.log(JSON.parse(res.data));
          console.log(JSON.parse(res.data).Company);
          this.Pr0132 = JSON.parse(res.data).Company;
          this.District = JSON.parse(res.data).District;
          this.ParentId = JSON.parse(res.data).ParentId;
          this.OrganizeId = JSON.parse(res.data).OrganizeId;
          this.Permission = JSON.parse(res.data).Permission;
          this.getBusinessOfficeRequest(permission);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getQueryVariable(variable) {
      console.log('userID');
      const query = window.location.search.substring(1);
      const vars = query.split('&');
      for (let i = 0; i < vars.length; i += 1) {
        const pair = vars[i].split('=');
        if (pair[0] === variable) { return pair[1]; }
      }
      return (false);
    },

    linkToIndex() {
      VueCookie.set('monthUserID', this.userID);
      VueCookie.set('monthFromWhichBtn', 'newAdded');
      this.getApprovalStatus();
      window.location = 'monthIndex.html';
    },

    getApprovalStatus() {
      if (this.queryTableAllData.length === 1 && this.queryTableAllData[0].CreateByUser === null) {
        VueCookie.set('monthFillStatus', '未填写');
      } else {
        this.queryTableAllData.forEach((item) => {
          if (this.userID === item.CreateByUser) {
            VueCookie.set('monthFillStatus', item.Status);
          }
        });
      }
    },
    getBusinessOfficeRequest(permission) {
      this.businessOffice = [];
      this.unitData = [];
      this.fourthSelectStore = [];
      this.$api.queryAndAddedUserInfo({ Pr0132: this.Pr0132 })
        .then((res) => {
          console.log(JSON.parse(res.data));
          this.businessOffice = JSON.parse(res.data);
          if (permission !== 1) {
            if (this.District !== '' && this.Permission !== 'C') {
              this.secondSelected = this.District;
            } else if (this.District !== '' && this.Permission === 'C') {
              this.secondSelected = this.ParentId;
            } else if (this.District === '' && this.Permission === 'B') {
              this.secondSelected = this.OrganizeId;
            } else {
              this.secondSelected = this.ParentId;
            }
            this.getUnitDataRequest(permission);
          }
          if (permission === 1) {
            this.secondSelected = '';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getUnitDataRequest(permission) {
      this.unitData = [];
      this.fourthSelectStore = [];
      const unitDataParams = {};
      if (permission !== 1) {
        if (this.District !== '' && this.Permission !== 'C') {
          unitDataParams.ParentId = this.District;
        } else if (this.District !== '' && this.Permission === 'C') {
          unitDataParams.ParentId = this.ParentId;
        } else if (this.District === '' && this.Permission === 'B') {
          unitDataParams.ParentId = this.OrganizeId;
        } else {
          unitDataParams.ParentId = this.ParentId;
        }
      } else {
        unitDataParams.ParentId = this.secondSelected;
      }
      console.log(unitDataParams);
      this.$api.queryAndAddedUserInfo(unitDataParams)
        .then((res) => {
          console.log(JSON.parse(res.data));
          this.unitData = JSON.parse(res.data);
          if (permission !== 1) {
            if (this.District !== '' && this.Permission !== 'C') {
              this.thirdSelected = this.ParentId;
              this.getFourthSelectStoreRequest(permission);
            } else if (this.District !== '' && this.Permission === 'C') {
              this.thirdSelected = this.OrganizeId;
              this.getFourthSelectStoreRequest(permission);
            } else if (this.District === '' && this.Permission === 'B') {
              this.thirdSelected = '';
              this.authorityJudgment();
              this.auditTableQueryRequest();
            } else {
              this.thirdSelected = this.OrganizeId;
              this.getFourthSelectStoreRequest(permission);
            }
          }
          if (permission === 1) {
            this.thirdSelected = '';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getFourthSelectStoreRequest(permission) {
      this.fourthSelectStore = [];
      const unitDataParams = {};
      if (permission !== 1) {
        if (this.District !== '' && this.Permission !== 'C') {
          unitDataParams.ParentId = this.ParentId;
        } else if (this.District !== '' && this.Permission === 'C') {
          unitDataParams.ParentId = this.OrganizeId;
        } else {
          unitDataParams.ParentId = this.OrganizeId;
        }
      } else {
        unitDataParams.ParentId = this.thirdSelected;
      }
      this.$api.queryAndAddedUserInfo(unitDataParams)
        .then((res) => {
          this.fourthSelectStore = JSON.parse(res.data);
          if (permission !== 1) {
            if (this.District !== '' && this.Permission !== 'C') {
              this.fourthSelectStoreSelected = this.OrganizeId;
            } else if (this.District !== '' && this.Permission === 'C') {
              this.fourthSelectStoreSelected = '';
            } else {
              this.fourthSelectStoreSelected = '';
            }
            this.authorityJudgment();
            this.auditTableQueryRequest();
          }
          if (permission === 1) {
            this.fourthSelectStoreSelected = '';
          }
          console.log(JSON.parse(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    },

    auditTableQueryRequest() {
      this.querySelectorArr = [];
      this.querySelectorArr.push(this.Pr0132);
      this.querySelectorArr.push(this.secondSelected);
      this.querySelectorArr.push(this.thirdSelected);
      this.querySelectorArr.push(this.fourthSelectStoreSelected);
      const queryArguments = {
        page: this.page,
        rows: this.rows,
        years: this.yearSelected,
        Month: this.monthSelected,
      };
      for (let i = 3; i >= 0; i -= 1) {
        if (this.querySelectorArr[i] !== '') {
          switch (true) {
            case i === 3:
              queryArguments.Store = this.fourthSelectStoreSelected;
              break;
            case i === 2:
              queryArguments.department = this.thirdSelected;
              break;
            case i === 1:
              queryArguments.District = this.secondSelected;
              break;
            case i === 0:
              queryArguments.company = this.Pr0132;
              break;
            default:
          }
          break;
        }
      }
      console.log(queryArguments);
      this.$api.monthQueryAndAdd(queryArguments)
        .then((res) => {
          this.copyYearSelected = this.yearSelected;
          this.copyMonthSelected = this.monthSelected;
          console.log(res.data);
          this.queryTableAllData = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    authorityJudgment() {
      for (let i = 0; i < 4; i += 1) {
        if (this.Permission === 'D') {
          this.selectDisabled[i] = true;
        } else if (this.Permission === 'C') {
          switch (i === 3) {
            case true:
              this.selectDisabled[i] = false;
              break;
            default:
              this.selectDisabled[i] = true;
          }
          // if (i === 3) {
          //   this.selectDisabled[i] = false;
          // } else {
          //   this.selectDisabled[i] = true;
          // }
        } else if (this.Permission === 'B') {
          switch (i >= 2) {
            case true:
              this.selectDisabled[i] = false;
              break;
            default:
              this.selectDisabled[i] = true;
          }
          // if (i >= 2) {
          //   this.selectDisabled[i] = false;
          // } else {
          //   this.selectDisabled[i] = true;
          // }
        } else if (this.Permission === 'A') {
          switch (i >= 1) {
            case true:
              this.selectDisabled[i] = false;
              break;
            default:
              this.selectDisabled[i] = true;
          }
          // if (i >= 1) {
          //   this.selectDisabled[i] = false;
          // } else {
          //   this.selectDisabled[i] = true;
          // }
        } else if (this.Permission === 'S') {
          this.selectDisabled[i] = false;
        }
      }
    },

    viewEditor(item) {
      VueCookie.set('monthUserID', this.userID);
      VueCookie.set('monthFillStatus', item.Status);
      VueCookie.set('monthCreateByUser', item.CreateByUser);
      VueCookie.set('monthFromWhichBtn', 'viewEditorBtn');
      VueCookie.set('monthViewEditorYear', this.yearSelected);
      VueCookie.set('monthViewEditorMonth', this.monthSelected);
      window.location = 'monthIndex.html';
    },
  },
  created() {
    this.userID = sessionStorage.getItem('userID');
    this.getUserRequest(0);
  },
};
</script>

<style lang="less" scoped>
.month-query-container{
  h1{
    text-align: center;
  }
}
.department-list li,.year-select li{
  list-style: none;
  float: left;
  height:30px;
  line-height: 30px;
  select{
    height:30px;
    margin-left:30px;
  }
  .month-select{
    margin-left: 10px;
  }
}
.department-list,.year-select{
  height:30px;
}
.year-select{
  select{
    width: 78px;
  }
}
.addBtn{
  width: 70px;
  height: 40px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background-color: #67c23a;
  border-color: #67c23a;
  color: white;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  text-decoration: none;
}
.department{
  position: relative;
}
.button-container{
  position: absolute;
  top:18px;
  left:800px;
  a,button{
    margin-left:30px;
  }
}
.show-query-table{
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}
.show-query-table td{
  padding:5px 0;
}
</style>
