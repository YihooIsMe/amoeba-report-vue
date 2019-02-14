<template>
<div class="switch-btn">
  <h2>请选择进入的身份</h2>
  <div class="container-btn">
    <el-tabs type="border-card">
      <el-tab-pane label="年度身份选择">
        <el-button type="primary" class="index" @click="joinQuery('index', 'year')">瑞虹一店</el-button>
        <el-button type="primary" class="index" @click="joinQuery('index4', 'year')">徐汇东曼一店</el-button>
        <el-button type="primary"  @click="joinQuery('zxb', 'year')">资讯部</el-button>
        <el-button type="primary"  @click="joinQuery('sh', 'year')">上海中介</el-button>
        <el-button type="primary"  @click="joinQuery('fwc', 'year')">上海服务处</el-button>
        <el-button type="primary" class="region" @click="joinQuery('region', 'year')">业务一区主管</el-button>
        <el-button type="primary" class="region" @click="joinQuery('region3', 'year')">业务三区主管</el-button>
        <el-button type="primary"  @click="joinQuery('cw', 'year')">财务部</el-button>
        <br><br>
        <el-button type="success" @click="joinQuery('szStore', 'year')">苏州店长</el-button>
        <el-button type="success" @click="joinQuery('szRegion', 'year')">苏州区总监</el-button>
        <el-button type="success" @click="joinQuery('szZj', 'year')">苏州中介</el-button>
      </el-tab-pane>
    </el-tabs>
    <el-tabs type="border-card">
      <el-tab-pane label="月度身份选择">
        <el-button type="primary" class="index" @click="joinQuery('index', 'month')">瑞虹一店</el-button>
        <el-button type="primary" class="index" @click="joinQuery('index2', 'month')">徐汇店</el-button>
        <el-button type="primary" class="index" @click="joinQuery('index3', 'month')">浦东一店</el-button>
        <el-button type="primary" class="index" @click="joinQuery('index4', 'month')">徐汇东曼一店</el-button>
        <el-button type="primary"  @click="joinQuery('zxb', 'month')">资讯部</el-button>
        <el-button type="primary"  @click="joinQuery('sh', 'month')">上海中介</el-button>
        <el-button type="primary"  @click="joinQuery('fwc', 'month')">上海服务处</el-button>
        <el-button type="primary" class="region" @click="joinQuery('region', 'month')">业务一区主管</el-button>
        <el-button type="primary" class="region" @click="joinQuery('region3', 'month')">业务三区主管</el-button>
        <el-button type="primary"  @click="joinQuery('cw', 'month')">财务部</el-button>
        <br><br>
        <el-button type="success" @click="joinQuery('szStore', 'month')">苏州店长</el-button>
        <el-button type="success" @click="joinQuery('szRegion', 'month')">苏州区总监</el-button>
        <el-button type="success" @click="joinQuery('szZj', 'month')">苏州中介</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
  <h4 class="red">注意：此页面只为方便演示而用！</h4>
</div>
</template>

<script>
export default {
  name: 'IdentitySwitch',
  methods: {
    joinQuery(index, page) {
      switch (true) {
        case index === 'index':
          sessionStorage.setItem('userID', '{85811A95-BB15-4914-8926-82E88F5E6E78}');
          break;
        case index === 'index2':
          sessionStorage.setItem('userID', '{C01391A2-352A-46A0-B2F2-34BDE19773BC}');
          break;
        case index === 'index3':
          sessionStorage.setItem('userID', '{EE66B8D3-612D-442E-97CC-158843CEF04D}');
          break;
        case index === 'index4':
          sessionStorage.setItem('userID', '{8607C099-4210-44AD-A6AB-21E10DCB564D}');
          break;
        case index === 'region':
          sessionStorage.setItem('userID', '{E1DD5988-4E98-403A-8BAA-23F0C1A3AE2C}');
          break;
        case index === 'region3':
          sessionStorage.setItem('userID', '{A896CAC6-0B8E-49C7-9547-18D5678C25A6}');
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
        case index === 'cw':
          sessionStorage.setItem('userID', '{48EF04F8-5902-4F88-A2CC-1C5BB5EA3FA8}');
          break;
        default:
      }
      if (page === 'year') {
        window.location = 'yearQueryAndAdded.html';
      } else if (page === 'month') {
        window.location = 'monthQueryAndAdded.html';
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .switch-btn{
    h2{
      text-align: center;
    }
    .container-btn{
      margin:auto;
    }
    .red{
      color:red;
      text-align: right;
    }
    .el-tabs{
      margin-top: 20px;
    }
  }

</style>
