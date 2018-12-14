<template>
  <div class="schedule">
    <ul>
      <li @click="setTabIndex(0)">归属费用<br><input type="text" readonly value="2222222"/></li>
      <li @click="setTabIndex(1)">联动收入<br><input type="text" readonly value="2222"/></li>
      <li @click="setTabIndex(2)">固定工资<br><input type="text" readonly value="2222"/></li>
      <li @click="setTabIndex(3)">变动工资<br><input type="text" readonly value="2222"/></li>
      <li @click="setTabIndex(4)">福利费<br><input type="text" readonly value="2222"/></li>
      <li @click="setTabIndex(5)">工作餐补<br><input type="text" readonly value="2222"/></li>
      <li @click="setTabIndex(6)">车贴<br><input type="text" readonly value="2222"/></li>
      <li @click="setTabIndex(7)">管理服务费<br><input type="text" readonly value="2222"/></li>
    </ul>
    <div v-show="tabIndex === 0">
      <SelectedOwnershipFee></SelectedOwnershipFee>
    </div>
    <div v-show="tabIndex === 1">
      <SelectedLinkageIncome></SelectedLinkageIncome>
    </div>
    <div v-show="tabIndex === 2">
      <SelectedFixedSalary></SelectedFixedSalary>
    </div>
    <div v-show="tabIndex === 3">
      <SelectedVariableWage></SelectedVariableWage>
    </div>
    <div v-show="tabIndex === 4">
      <SelectedWelfareFee></SelectedWelfareFee>
    </div>
    <div v-show="tabIndex === 5">
      <SelectedWorkingMeal></SelectedWorkingMeal>
    </div>
    <div v-show="tabIndex === 6">
      <SelectedCarSticker></SelectedCarSticker>
    </div>
    <div v-show="tabIndex === 7">
      <SelectedManagementService></SelectedManagementService>
    </div>
  </div>
</template>

<script>
import SelectedOwnershipFee from './ownershipFee.vue';
import SelectedLinkageIncome from './linkageIncome.vue';
import SelectedFixedSalary from './fixedSalary.vue';
import SelectedVariableWage from './variableWage.vue';
import SelectedWelfareFee from './welfareFee.vue';
import SelectedWorkingMeal from './workingMeal.vue';
import SelectedCarSticker from './carSticker.vue';
import SelectedManagementService from './managementService.vue';

export default {
  name: 'scheduleTable',
  components: {
    SelectedOwnershipFee,
    SelectedLinkageIncome,
    SelectedFixedSalary,
    SelectedVariableWage,
    SelectedWelfareFee,
    SelectedWorkingMeal,
    SelectedCarSticker,
    SelectedManagementService,
  },
  data() {
    return {
      tabIndex: 0,
    };
  },
  methods: {
    setTabIndex(index) {
      this.tabIndex = index;
    },
  },
};
</script>

<style lang="less" scoped>
.schedule{
  position: relative;
  border:1px solid transparent;
  ul{
    position: absolute;
    top:20px;
    left:50%;
    margin-left: -460px;
    li{
      list-style: none;
      float: left;
      width: 100px;
      text-align: center;
      background-color: #1E9FFF;
      color:white;
      margin-left:10px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      cursor: pointer;
      input{
        width: 90%;
        height:25px !important;
        border:none;
        background-color: #1E9FFF;
        outline:none;
        text-align: center;
        color:white;
        font-size:18px;
        cursor: pointer;
      }
    }
  }
  ul:after{
    content: '';
    display: table;
    clear: both;
  }
}
</style>
