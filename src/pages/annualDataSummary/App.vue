<template>
  <div id="app">
    <AnnualSummary></AnnualSummary>
  </div>
</template>
<script>
import AnnualSummary from './views/annualSummary.vue';

export default {
  name: 'Content',
  components: { AnnualSummary },
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
