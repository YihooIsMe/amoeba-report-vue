<template>
  <div id="app">
    <DepartmentContainer></DepartmentContainer>
  </div>
</template>
<script>
import DepartmentContainer from './views/monthDepartmentContainer.vue';

export default {
  name: 'Content',
  components: { DepartmentContainer },
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
