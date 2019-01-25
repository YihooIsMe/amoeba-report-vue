import { Message } from 'element-ui';

export default {
  ElErrorMessage(info) {
    Message({
      message: '错误:' + info + '. 请联系相关人员!',
      type: 'error',
      duration: 5000,
    });
  },
};
