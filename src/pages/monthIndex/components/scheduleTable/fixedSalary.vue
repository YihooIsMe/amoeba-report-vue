<template>
    <div class="fixedSalary">
      <table class="fixedSalaryTable" v-if="fixedSalaryData.length>0" border="1">
        <thead>
        <tr>
          <th>职称</th>
          <th>固定薪资</th>
          <th>人数</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in fixedSalaryData" :key="i">
          <td>{{item.Name}}</td>
          <td>{{item.Valuation}}</td>
          <td><input type="text"></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
export default {
  name: 'fixedSalary',
  props: ['fixedSalaryData'],
};
</script>

<style scoped>

</style>
