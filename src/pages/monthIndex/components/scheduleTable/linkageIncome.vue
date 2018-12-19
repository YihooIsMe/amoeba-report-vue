<template>
    <div class="linkageIncome">
      <table class="linkageIncomeTable" v-if="linkageIncomeData.length>0" border="1">
        <thead>
        <tr>
          <th>联动收入</th>
          <th>计价</th>
          <th>人数/次数/时数</th>
          <th>总计</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in linkageIncomeData" :key="i">
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td><input type="text"/></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
export default {
  name: 'linkageIncome',
  props: ['linkageIncomeData'],
};
</script>

<style lang="less" scoped>

</style>
