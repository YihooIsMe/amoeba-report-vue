import { Message } from 'element-ui';

export default {
  scheduleHandleInputNum(e) {
    if (e.keyCode !== 8 && e.keyCode !== 13) {
      if (!/^\d+$/.test(e.target.value)) {
        Message({
          message: '请输入整数',
          duration: 1000,
          type: 'warning',
        });
        e.target.value = '';
      }
    }
  },

  calculation(a, b, c, d, e) {
    const currentTrAllTd = document.querySelectorAll(b + '>tbody>tr:nth-child(' + a + ')>td');
    currentTrAllTd[e].innerHTML = Number(currentTrAllTd[c].innerHTML) * Number(currentTrAllTd[d].getElementsByTagName('input')[0].value);
  },

  sumCalculate(i, className) {
    let sum = 0;
    document.querySelectorAll(className + '>tbody>tr').forEach((item) => {
      sum = Number(item.getElementsByTagName('td')[i].innerHTML) + sum;
    });
    return sum;
  },
};
