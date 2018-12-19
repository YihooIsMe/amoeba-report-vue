<template>
    <div class="workingMeal">
      <table class="workingMealTable" v-if="workingMealData.length>0" border="1">
        <thead>
        <tr>
          <th></th>
          <th>数额</th>
          <th>天数</th>
          <th>预估</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i ) in workingMealData" :key="i">
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
  name: 'workingMeal',
  props: ['workingMealData'],
};
</script>

<style scoped>

</style>
