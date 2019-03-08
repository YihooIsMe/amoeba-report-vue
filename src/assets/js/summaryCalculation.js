export default {
  getQueryEl(className, i) {
    return document.querySelector('.monthly-summary-container table.monthly-summary tr.' + className + '>td:nth-child(' + i + ')>input');
  },

  tableColumnEl(i) {
    return {
      // 签约金损益
      signingGoldProfitLoss: this.getQueryEl('F3', i),
      // 收入合计
      totalIncome: this.getQueryEl('A6', i),
      // 營業支出
      operatingExpenses: this.getQueryEl('F0', i),
      // 管理服务费
      managementServiceFee: this.getQueryEl('F1', i),
      // 归属费用
      ownershipFee: this.getQueryEl('F2', i),
      // 签约金损益收益率
      contractedGoldProfitLoss: this.getQueryEl('F4', i),
      // 业绩损益
      performanceGainsLosses: this.getQueryEl('G1', i),
      // 业绩
      performance: this.getQueryEl('G0', i),
      // 減：营业税金
      businessTaxReduction: this.getQueryEl('A4', i),
      // 业绩损益收益率
      performanceGainsLossesRate: this.getQueryEl('G2', i),
      // 出勤时间
      attendanceTime: this.getQueryEl('H0', i),
      // 单位时间损益
      unitTimeProfitLoss: this.getQueryEl('H1', i),
    };
  },

  // 月预定计算,也就是第二列
  currentColumnCalculation(i) {
    // 签约金损益 = 收入合计 - 營業支出 - 管理服务费 - 归属费用;
    this.tableColumnEl(i).signingGoldProfitLoss.value = Number(this.tableColumnEl(i).totalIncome.value) - Number(this.tableColumnEl(i).operatingExpenses.value) - Number(this.tableColumnEl(i).managementServiceFee.value) - Number(this.tableColumnEl(i).ownershipFee.value);
    // 签约金损益收益率 = 签约金损益 / 收入合计
    if (Number(this.tableColumnEl(i).totalIncome.value) !== 0) {
      this.tableColumnEl(i).contractedGoldProfitLoss.value = this.addPercent(Number(this.tableColumnEl(i).signingGoldProfitLoss.value) / Number(this.tableColumnEl(i).totalIncome.value));
    } else {
      this.tableColumnEl(i).contractedGoldProfitLoss.value = '0%';
    }
    // 业绩损益 = 业绩 - 減：营业税金 - 營業支出 - 管理服务费 - 归属费用
    this.tableColumnEl(i).performanceGainsLosses.value = Number(this.tableColumnEl(i).performance.value) - Number(this.tableColumnEl(i).businessTaxReduction.value) - Number(this.tableColumnEl(i).operatingExpenses.value) - Number(this.tableColumnEl(i).managementServiceFee.value) - Number(this.tableColumnEl(i).ownershipFee.value);
    // 业绩损益收益率 = 业绩损益 / 业绩
    if (Number(this.tableColumnEl(i).performance.value) !== 0) {
      this.tableColumnEl(i).performanceGainsLossesRate.value = this.addPercent(Number(this.tableColumnEl(i).performanceGainsLosses.value) / Number(this.tableColumnEl(i).performance.value));
    } else {
      this.tableColumnEl(i).performanceGainsLossesRate.value = '0%';
    }
    // 单位时间损益 = 签约金损益 / 出勤时间
    if (Number(this.tableColumnEl(i).attendanceTime.value) !== 0) {
      this.tableColumnEl(i).unitTimeProfitLoss.value = Math.round(Number(this.tableColumnEl(i).signingGoldProfitLoss.value) / Number(this.tableColumnEl(i).attendanceTime.value));
    } else {
      this.tableColumnEl(i).unitTimeProfitLoss.value = '0';
    }
  },

  // 预定比计算
  // molecule分子
  // denominator分母
  ratio(listData, tableClassName, moleculeIndex, denominatorIndex, targetIndex) {
    listData.forEach((item) => {
      const currentEls = document.querySelectorAll('table.' + tableClassName + ' tr.' + item.className + '>td>input');
      if ((item.className === 'F4' || item.className === 'G2') && currentEls[moleculeIndex].value !== '0%') {
        currentEls[targetIndex].value = this.addPercent(parseFloat(currentEls[denominatorIndex].value) / parseFloat(currentEls[moleculeIndex].value));
      } else if (Number(currentEls[moleculeIndex].value) !== 0) {
        currentEls[targetIndex].value = this.addPercent(Number(currentEls[denominatorIndex].value) / Number(currentEls[moleculeIndex].value));
      } else {
        currentEls[targetIndex].value = '0%';
      }
    });
  },

  // target = a - b;
  // 预定实际差异;
  bookActualDiff(listData, tableClassName, a, b, target) {
    listData.forEach((item) => {
      const currentEls = document.querySelectorAll('table.' + tableClassName + ' tr.' + item.className + '>td>input');
      if (item.className === 'F4' || item.className === 'G2') {
        currentEls[target].value = (parseFloat(currentEls[a].value) - parseFloat(currentEls[b].value)) + '%';
      } else {
        currentEls[target].value = Number(currentEls[a].value) - Number(currentEls[b].value);
      }
    });
  },
  // 增加千分符
  addPercent(val) {
    return Math.round(val * 100) + '%';
  },

  // 去除千分符
  remPercent(val) {
    return parseFloat(val) / 100;
  },
};
