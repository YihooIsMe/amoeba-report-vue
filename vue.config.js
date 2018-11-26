module.exports = {
  // baseUrl: './',
  pages: {
    index: {
      entry: 'src/pages/index/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '阿米巴统计报表',
    },
    queryAndAdded: {
      entry: 'src/pages/queryAndAdded/main.js',
      template: 'public/index.html',
      filename: 'queryAndAdded.html',
      title: '核算表系统年度计划查询及新增',
    },
  },
  devServer: {
    port: 80,
    index: 'index.html',
  },
};
