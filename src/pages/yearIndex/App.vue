<template>
  <div id="app">
    <TableContainer></TableContainer>
  </div>
</template>
<script>
import TableContainer from './views/Container.vue';

export default {
  name: 'Content',
  components: { TableContainer },
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.el-loading-info>.el-loading-spinner>.el-loading-text{
  font-size:18px !important;
}
</style>
