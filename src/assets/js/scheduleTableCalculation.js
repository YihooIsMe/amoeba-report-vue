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

  // a:当前数组对象
  // b:当前table的className
  // c:基数项
  // d:人数
  // e:计算合计数
  calculation(a, b, c, d, e) {
    console.log(a);
    a.forEach((el) => {
      const currentTrAllInput = document.querySelectorAll(b + '>tbody>tr.' + el.className + '>td>input');
      if (el.IsRead === 0 || el.IsRead === 1) {
        currentTrAllInput[e].value = Number(currentTrAllInput[c].value) * Number(currentTrAllInput[d].value);
      }
      if (el.IsRead === 2) {
        currentTrAllInput[e - 1].value = Number(currentTrAllInput[d - 1].value);
      }
      if (el.IsRead === 3) {
        currentTrAllInput[e].value = Number(currentTrAllInput[d].value);
      }
    });
  },

  sumCalculate(className) {
    let sum = 0;
    document.querySelectorAll(className + '>tbody>tr').forEach((item) => {
      if (item.getAttribute('class') === 'FC15') {
        sum = -Number(item.querySelector('td:last-child>input').value) + sum;
      } else {
        sum = Number(item.querySelector('td:last-child>input').value) + sum;
      }
    });
    return sum;
  },
};
