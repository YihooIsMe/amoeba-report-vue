const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  // baseUrl: './',
  pages: {
    index: {
      entry: 'src/pages/yearIndex/main.js',
      template: 'public/index.html',
      filename: 'yearIndex.html',
      title: '阿米巴统计报表',
    },
    queryAndAdded: {
      entry: 'src/pages/yearQueryAndAdded/main.js',
      template: 'public/index.html',
      filename: 'yearQueryAndAdded.html',
      title: '核算表系统年度计划查询及新增',
    },
    monthQueryAndAdded: {
      entry: 'src/pages/monthIndex/main.js',
      template: 'public/index.html',
      filename: 'monthIndex.html',
      title: '阿米巴月度统计报表',
    },
    identitySwitch: {
      entry: 'src/pages/identitySwitch/main.js',
      template: 'public/index.html',
      filename: 'identitySwitch.html',
      title: '权限选择',
    },
    showYearData: {
      entry: 'src/pages/showYearData/main.js',
      template: 'public/index.html',
      filename: 'showYearData.html',
      title: '汇总数据展示',
    },
  },
  devServer: {
    port: 80,
    index: 'monthIndex.html',
  },
  // chainWebpack: config => {
  //   config.resolve.alias
  //     .set('@', resolve('src'));
  // },
  // vue-cli 3默认的alias的路径为则按照上面的这种方式@/替代src/,如果需要修改,则按照上面的这种形式进行更改;
};
