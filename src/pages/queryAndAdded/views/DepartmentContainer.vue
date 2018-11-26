<template>
    <div class="query-container">
      <h1>核算表系统年度计划</h1>
      <div class="deparment">
      <ul v-if="threeAreas.length>0">
        <li>
          <select v-model="threeAreaSelected" @change="judgeWhichSelected($event,'Secondary')">
            <option value='' data-lv="">请选择</option>
            <option v-for="(item, index) in threeAreas" :key="index" :value="item.F_Id" :data-lv="item.Lv">{{item.F_FullName}}</option>
          </select>
        </li>
        <li>
          <select v-model="businessOfficeSelected" @change="judgeWhichSelected($event,'ThirdLevel')">
            <option value='' data-lv="all">全部</option>
            <option v-for="(item, index) in businessOffice" :key="index" :value="item.F_Id" :data-lv="item.Lv">{{item.F_FullName}}</option>
          </select>
        </li>
        <li>
          <select v-model="unitDataSelected" @change="judgeWhichSelected($event,'LevelFour')">
            <option value='' data-lv="all">全部</option>
            <option v-for="(item, index) in unitData" :key="index" :value="item.F_Id" :data-lv="item.Lv">{{item.F_FullName}}</option>
          </select>
        </li>
        <li>
          <select v-model="fourthSelectStoreSelected">
            <option value='' data-lv="all">全部</option>
            <option v-for="(item, index) in fourthSelectStore" :key="index" :value="item.F_Id" :data-lv="item.Lv">{{item.F_FullName}}</option>
          </select>
        </li>
      </ul>
      </div>
      <router-link to="/index" class="addBtn">查询</router-link>
      <router-view/>
    </div>
</template>

<script>
import axios from 'axios';
import '../../../mock';

export default {
  name: 'QueryContainer',
  data() {
    return {
      userID: '{8F5FF78A-E0C0-40EE-91ED-88B32A247DE9}',
      getUrl: 'http://10.100.250.153:99/api/Organization',
      organizationListData: [],
      threeAreas: [],
      threeAreaSelected: '',
      businessOffice: [],
      businessOfficeSelected: '',
      unitData: [],
      unitDataSelected: '',
      fourthSelectStore: [],
      fourthSelectStoreSelected: '',
    };
  },
  methods: {
    getUserRequest() {
      axios.get(this.getUrl).then((res) => {
        this.organizationListData = res.data.list;
        this.threeAreas = res.data.list.FirstLevel;
        // this.businessOffice = res.data.list.Secondary;
        // this.unitData = res.data.list.ThirdLevel;
        // this.fourthSelectStore = res.data.list.LevelFour;
        console.log(this.threeAreas);
        console.log(res.data.list);
      }).catch((errMsg) => {
        console.log(errMsg);
      });
    },

    judgeWhichSelected(event, index) {
      switch (true) {
        case index === 'Secondary':
          this.businessOffice = [];
          break;
        case index === 'ThirdLevel':
          this.unitData = [];
          break;
        case index === 'LevelFour':
          this.fourthSelectStore = [];
          break;
        default:
      }
      console.log(event.target[event.target.selectedIndex].dataset.lv);
      const selectedLv = event.target[event.target.selectedIndex].dataset.lv;
      const selectLevel = this.organizationListData[index];
      if (index === 'Secondary') {
        for (let i = 0; i < selectLevel.length; i += 1) {
          if (selectedLv + '1' === selectLevel[i].Lv) {
            this.businessOffice.push(selectLevel[i]);
          }
        }
      } else {
        for (let i = 0; i < selectLevel.length; i += 1) {
          if ('00' + (Number(selectedLv) + 1).toString() === selectLevel[i].Lv && index === 'ThirdLevel') {
            this.unitData.push(selectLevel[i]);
          }
          if ('00' + (Number(selectedLv) + 1).toString() === selectLevel[i].Lv && index === 'LevelFour') {
            this.fourthSelectStore.push(selectLevel[i]);
          }
        }
      }
    },
  },
  created() {
    this.getUserRequest();
  },
};
</script>

<style lang="less" scoped>
.query-container{
  h1{
    text-align: center;
  }
}
</style>
