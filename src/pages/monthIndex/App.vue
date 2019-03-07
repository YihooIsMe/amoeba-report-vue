<template>
  <div id="app">
    <MonthContainer></MonthContainer>
  </div>
</template>
<script>
import MonthContainer from './views/Index.vue';

export default {
  name: 'Content',
  components: { MonthContainer },
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
    box-sizing: border-box;
  }
</style>
