<template>
<div class="switch-btn">
  <h2>请选择进入的身份</h2>
  <div class="container-btn">
    <el-button type="primary" class="store" @click="joinQuery('store')">瑞虹一店</el-button>
    <el-button type="primary"  @click="joinQuery('zxb')">资讯部</el-button>
    <el-button type="primary"  @click="joinQuery('sh')">上海中介</el-button>
    <el-button type="primary"  @click="joinQuery('fwc')">上海服务处</el-button>
    <el-button type="primary" class="region" @click="joinQuery('region')">业务一区主管</el-button>
    <br><br>
    <el-button type="success" @click="joinQuery('szStore')">苏州店长</el-button>
    <el-button type="success" @click="joinQuery('szRegion')">苏州区总监</el-button>
    <el-button type="success" @click="joinQuery('szZj')">苏州中介</el-button>
  </div>
  <h4 class="red">注意：此页面只为方便演示而用！</h4>
</div>
</template>

<script>
export default {
  name: 'IdentitySwitch',
  methods: {
    joinQuery(index) {
      switch (true) {
        case index === 'store':
          sessionStorage.setItem('userID', '{85811A95-BB15-4914-8926-82E88F5E6E78}');
          break;
        case index === 'region':
          sessionStorage.setItem('userID', '{E1DD5988-4E98-403A-8BAA-23F0C1A3AE2C}');
          break;
        case index === 'zxb':
          sessionStorage.setItem('userID', '{8F5FF78A-E0C0-40EE-91ED-88B32A247DE9}');
          break;
        case index === 'sh':
          sessionStorage.setItem('userID', '{2D6D9E2B-F519-4093-A0C9-1C3478DE458B}');
          break;
        case index === 'fwc':
          sessionStorage.setItem('userID', '{BD35F599-7256-4774-95E2-FA59D777BDD3}');
          break;
        case index === 'szStore':
          sessionStorage.setItem('userID', '{D8306434-5C01-4B34-B9D3-B6EBE91C0BFA}');
          break;
        case index === 'szRegion':
          sessionStorage.setItem('userID', '{1EF1DD9B-6281-4A96-BC4C-141531E4D150}');
          break;
        case index === 'szZj':
          sessionStorage.setItem('userID', '{71796631-3E58-43E9-9BDF-D0F86AC5CFCF}');
          break;
        default:
      }
      window.location = 'yearQueryAndAdded.html';
    },
  },
};
</script>

<style lang="less" scoped>
h2{
  text-align: center;
}
  .container-btn{
    margin:50px auto;
  }
  .red{
    color:red;
    text-align: right;
  }
</style>
