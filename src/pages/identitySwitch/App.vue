<template>
  <div id="app">
    <IdentitySwitch></IdentitySwitch>
  </div>
</template>
<script>
import IdentitySwitch from './views/IdentitySwitch.vue';

export default {
  name: 'Content',
  components: { IdentitySwitch },
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
