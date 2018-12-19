<template>
    <div class="welfareFee">
      <table class="welfareFeeTable" v-if="welfareFeeTableData.length>0" border="1">
        <thead>
        <tr>
          <th></th>
          <th>数额</th>
          <th>人数</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in welfareFeeTableData" :key="i">
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
  name: 'welfareFee',
  props: ['welfareFeeTableData'],
};
</script>

<style scoped>

</style>
