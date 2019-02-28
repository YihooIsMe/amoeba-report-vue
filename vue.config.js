// const path = require('path');
//
// function resolve(dir) {
//   return path.join(__dirname, dir);
// }
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  // baseUrl: './',
  pages: {
    yearIndex: {
      entry: 'src/pages/yearIndex/main.js',
      template: 'public/index.html',
      filename: 'yearIndex.html',
      title: '阿米巴统计报表',
    },
    yearQueryAndAdded: {
      entry: 'src/pages/yearQueryAndAdded/main.js',
      template: 'public/index.html',
      filename: 'yearQueryAndAdded.html',
      title: '核算表系统年度计划查询及新增',
    },
    monthQuery: {
      entry: 'src/pages/monthQueryAndAdded/main.js',
      template: 'public/index.html',
      filename: 'monthQueryAndAdded.html',
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
    annualDataSummary: {
      entry: 'src/pages/annualDataSummary/main.js',
      template: 'public/index.html',
      filename: 'annualDataSummary.html',
      title: '年度汇总表',
    },
    monthlyDataSummary: {
      entry: 'src/pages/monthlyDataSummary/main.js',
      template: 'public/index.html',
      filename: 'monthlyDataSummary.html',
      title: '月度汇总表',
    },
  },
  devServer: {
    port: 85,
    index: 'identitySwitch.html',
  },
  configureWebpack: (config) => {
    if (process.env.VUE_APP_NAME === 'production') {
      config.optimization.minimizer.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
              pure_funcs: ['console.log'],
            },
          },
        }),
      );
    }
  },
  // configureWebpack: {
  //   optimization: {
  //     minimizer: [
  //       new UglifyJsPlugin({
  //         uglifyOptions: {
  //           compress: {
  //             drop_console: true,
  //             pure_funcs: ['console.log'],
  //           },
  //         },
  //       }),
  //     ],
  //   },
  // },
  // configureWebpack: {
  //   optimization: {
  //     splitChunks: {
  //       minSize: 10000,
  //       maxSize: 250000,
  //     },
  //   },
  // },
  // chainWebpack: config => {
  //   config.resolve.alias
  //     .set('@', resolve('src'));
  // },
  // vue-cli 3默认的alias的路径为则按照上面的这种方式@/替代src/,如果需要修改,则按照上面的这种形式进行更改;
};
