<template>
  <div id="app">
<!--    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-views/>-->
  <TableContainer
    @closeFirstFullscreenLoading="closeFirstFullscreenLoading"
    @saveToDraftBox="firstFullscreenLoading"
    @saveToDraftBoxCompleted="closeFirstFullscreenLoading"
    @getDataFromDraft="firstFullscreenLoading"
    @readDraftCompleted="closeFirstFullscreenLoading"></TableContainer>
  </div>
</template>
<script>
import TableContainer from './views/Container.vue';

export default {
  name: 'Content',
  components: { TableContainer },
  data() {
    return {
      firstLoading: '',
    };
  },
  methods: {
    firstFullscreenLoading(isSave) {
      this.firstLoading = this.$loading({
        lock: true,
        text: isSave,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'el-loading-info',
      });
    },
    closeFirstFullscreenLoading() {
      this.firstLoading.close();
    },
  },
  created() {
    this.firstFullscreenLoading('Loading');
  },
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
