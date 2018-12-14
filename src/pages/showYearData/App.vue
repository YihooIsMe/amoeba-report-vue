<template>
  <div id="app">
    <YearData></YearData>
  </div>
</template>
<script>
import YearData from './views/DataContainer.vue';

export default {
  name: 'Container',
  components: { YearData },
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
