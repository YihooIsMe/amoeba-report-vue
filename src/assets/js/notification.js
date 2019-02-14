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
};
