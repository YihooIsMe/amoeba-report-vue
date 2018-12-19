<template>
    <div class="ownershipFee">
      <table class="ownershipFeeTable" v-if="ownershipFeeData.length>0" border="1">
        <thead>
        <tr>
          <th>类别</th>
          <th>计价</th>
          <th>说明</th>
          <th>人数/件数/人次/金额</th>
          <th>总计</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in ownershipFeeData" :key="index">
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td>{{item.Description}}</td>
          <td><input type="text"/></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
export default {
  name: 'ownershipFee',
  props: ['ownershipFeeData'],
};
</script>

<style lang="less" scoped>

</style>
