<template>
  <div id="app">
    <MonthlySummary></MonthlySummary>
  </div>
</template>
<script>
import MonthlySummary from './views/monthlySummary.vue';

export default {
  name: 'Content',
  components: { MonthlySummary },
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 1200px;
  min-width: 1200px;
  margin: auto;
}
</style>
