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
  },
  devServer: {
    port: 80,
    index: 'identitySwitch.html',
  },
};
