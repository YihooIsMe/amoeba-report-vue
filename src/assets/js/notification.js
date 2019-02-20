import { Message } from 'element-ui';

export default {
  ElErrorMessage(info) {
    Message({
      message: '错误:' + info + '. 请联系相关人员!',
      type: 'error',
      duration: 5000,
    });
  },
  getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i += 1) {
      const pair = vars[i].split('=');
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return false;
  },
  injectYearAndMonth() {
    let Years;
    let Month;
    // 从新增按钮过来的；
    if (this.getQueryVariable('monthFromWhichBtn') === '0') {
      if (this.getQueryVariable('isFixedMonth') === '1') {
        Years = 2019;
        Month = 2;
      }
      if (this.getQueryVariable('isFixedMonth') === '0') {
        if (new Date().getMonth() + 2 === 13) {
          Years = new Date().getFullYear() + 1;
          Month = 1;
        } else {
          Years = new Date().getFullYear();
          Month = new Date().getMonth() + 2;
        }
      }
    }
    // 从查询按钮过来的数据；
    if (this.getQueryVariable('monthFromWhichBtn') === '1') {
      Years = this.getQueryVariable('monthViewEditorYear');
      Month = this.getQueryVariable('monthViewEditorMonth');
    }
    return { Years, Month };
  },
};
