<template>
    <div class="variableWage">
      <table class="variableWageTable" v-if="variableWageData.length>0" border="1">
        <thead>
        <tr>
          <th>奖励</th>
          <th>基数</th>
          <th>业绩</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in variableWageData" :key="i">
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
  name: 'variableWage',
  props: ['variableWageData'],
};
</script>

<style scoped>

</style>
