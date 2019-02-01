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

  // IsRead:0 基数项与人数项单元格分开,基数项自己输入,基数项*人数
  // IsRead:1 基数项与人数项单元格分开,基数项不能输入,基数项*人数
  // IsRead:2 基数项与人数项单元格合并,计算合计数=合并数据
  // IsRead:3 基数项与人数项单元格分开,基数项不能输入是说明,不参与计算,计算合计数=人数项这一单元格数据
  calculation(a, b, c, d, e) {
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
