/* 公共的计算方法都在这里 */
import Vue from 'vue';
import { Message } from 'element-ui';

export default {
  VueSigningRatio: '',
  fromWhere: '',
  department: '',
  districtOrStore: '',
  calHandleInputNum(e) {
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
  judgeDepartment(val) {
    this.department = val;
  },
  whereUse(val) {
    this.fromWhere = val;
  },
  getVueSigningRatio(val) {
    this.VueSigningRatio = val;
  },
  /* Type类型为0时 */
  tableOne(index) {
    return {
      /* 原始签约金 */
      OriginalContractFee: document.querySelector('tr.A0>td:nth-child(' + index + ') input'),
      /* 减：折让退回 */
      DiscountRefund: document.querySelector('tr.A1>td:nth-child(' + index + ') input'),
      /* 营业收入合计 */
      TotalOperatingIncome: document.querySelector('tr.A3>td:nth-child(' + index + ') input'),
      /* 減：营业税金 */
      BusinessTax: document.querySelector('tr.A4>td:nth-child(' + index + ') input'),
      /* 营业收入净额 */
      OperatingNetProfit: document.querySelector('tr.A5>td:nth-child(' + index + ') input'),
      /* 联动收入 */
      LinkageIncome: document.querySelector('tr.A2>td:nth-child(' + index + ') input'),
      /* 收入合计 */
      TotalIncome: document.querySelector('tr.A6>td:nth-child(' + index + ') input'),
    };
  },
  tableOneCalculation(index) {
    /** 营业收入合计* */
    if (this.tableOne(index).TotalOperatingIncome) {
      this.tableOne(index).TotalOperatingIncome.value = (this.remSep(this.tableOne(index).OriginalContractFee.value) - this.remSep(this.tableOne(index).DiscountRefund.value)).toLocaleString();
    }
    /** 減：营业税金* */
    if (this.tableOne(index).BusinessTax) {
      // this.tableOne(index).BusinessTax.value = (Number(this.remSep(this.tableOne(index).TotalOperatingIncome.value)) * 0.05.toFixed(2)).toLocaleString();
      this.tableOne(index).BusinessTax.value = Math.round(this.remSep(this.tableOne(index).TotalOperatingIncome.value) * 0.05).toLocaleString();
    }
    /* 营业收入净额 */
    if (this.tableOne(index).OperatingNetProfit) {
      this.tableOne(index).OperatingNetProfit.value = (this.remSep(this.tableOne(index).TotalOperatingIncome.value) - this.remSep(this.tableOne(index).BusinessTax.value)).toLocaleString();
    }
    /* 收入合计 */
    if (this.tableOne(index).TotalIncome) {
      this.tableOne(index).TotalIncome.value = (this.remSep(this.tableOne(index).OperatingNetProfit.value) + this.remSep(this.tableOne(index).LinkageIncome ? this.tableOne(index).LinkageIncome.value : 0)).toLocaleString();
    }
  },

  /* Type类型为1时 */
  tableTwo(index) {
    return {
      /* 工资 */
      Wage: document.querySelector('tr.B0>td:nth-child(' + index + ') input'),
      /* 固定工资 */
      FixedSalary: document.querySelector('tr.B1>td:nth-child(' + index + ') input'),
      /* 变动工资 */
      VariableWage: document.querySelector('tr.B2>td:nth-child(' + index + ') input'),
      /* 预提奖金 */
      WithholdingBonus: document.querySelector('tr.B3>td:nth-child(' + index + ') input'),
      /* 福利费 */
      WelfareFee: document.querySelector('tr.B4>td:nth-child(' + index + ') input'),
      /* 住宿费 */
      AccommodationFee: document.querySelector('tr.B5>td:nth-child(' + index + ') input'),
      /* 社会保险金 */
      SocialInsurancePremium: document.querySelector('tr.B6>td:nth-child(' + index + ') input'),
      /* 人身保险 */
      LifeInsurance: document.querySelector('tr.B7>td:nth-child(' + index + ') input'),
      /* 工作餐费 */
      WorkingMeal: document.querySelector('tr.B8>td:nth-child(' + index + ') input'),
      /* 制服费 */
      UniformFee: document.querySelector('tr.B9>td:nth-child(' + index + ') input'),
      /* 车贴 */
      CarSticker: document.querySelector('tr.B10>td:nth-child(' + index + ') input'),
      /* 教育训练费 */
      EducationalTrainingFee: document.querySelector('tr.B11>td:nth-child(' + index + ') input'),
      /* 劳务费 */
      LaborCosts: document.querySelector('tr.B12>td:nth-child(' + index + ') input'),
      /* 公积金 */
      ProvidentFund: document.querySelector('tr.B13>td:nth-child(' + index + ') input'),
      /* 用人费用 */
      EmploymentFee: document.querySelector('tr.B14>td:nth-child(' + index + ') input'),
    };
  },
  tableTwoCalculation(index) {
    /* 工资 */
    this.tableTwo(index).Wage.value = (this.remSep(this.tableTwo(index).FixedSalary.value) + this.remSep(this.tableTwo(index).VariableWage.value)).toLocaleString();
    /* 社会保险金 */
    // this.tableTwo(index).SocialInsurancePremium.value = (Number(this.remSep(this.tableTwo(index).Wage.value)) * 0.305.toFixed(2)).toLocaleString();
    if (this.fromWhere === 'yearIndex') {
      /* 社会保险金 */
      this.tableTwo(index).SocialInsurancePremium.value = (this.remSep(this.tableTwo(index).Wage.value) * 0.305).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      /* 公积金 */
      // this.tableTwo(index).ProvidentFund.value = ((Number(this.remSep(this.tableTwo(index).Wage.value)) * 0.07).toFixed(2)).toLocaleString();
      this.tableTwo(index).ProvidentFund.value = (this.remSep(this.tableTwo(index).Wage.value) * 0.07).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    if (this.fromWhere === 'monthIndex') {
      if (this.districtOrStore === 'district') {
        /* 社会保险金 */
        this.tableTwo(index).SocialInsurancePremium.value = (this.remSep(this.tableTwo(index).Wage.value) * 0.305).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        /* 公积金 */
        // this.tableTwo(index).ProvidentFund.value = ((Number(this.remSep(this.tableTwo(index).Wage.value)) * 0.07).toFixed(2)).toLocaleString();
        this.tableTwo(index).ProvidentFund.value = (this.remSep(this.tableTwo(index).Wage.value) * 0.07).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      if (this.districtOrStore === 'store') {

      }
    }
    /* 用人费用 */
    this.tableTwo(index).EmploymentFee.value = (this.remSep(this.tableTwo(index).Wage.value) + this.remSep(this.tableTwo(index).WithholdingBonus.value) + this.remSep(this.tableTwo(index).WelfareFee.value) + this.remSep(this.tableTwo(index).AccommodationFee.value) + this.remSep(this.tableTwo(index).SocialInsurancePremium.value) + this.remSep(this.tableTwo(index).LifeInsurance.value) + this.remSep(this.tableTwo(index).WorkingMeal.value) + this.remSep(this.tableTwo(index).UniformFee.value) + this.remSep(this.tableTwo(index).CarSticker.value) + this.remSep(this.tableTwo(index).EducationalTrainingFee.value) + this.remSep(this.tableTwo(index).LaborCosts.value) + this.remSep(this.tableTwo(index).ProvidentFund.value)).toLocaleString();
  },

  /* Type类型为2时 */
  tableThree(index) {
    return {
      /* 折旧费 */
      Depreciation: document.querySelector('tr.C0>td:nth-child(' + index + ') input'),
      /* 有形资产摊销 */
      AmortizationOfTangibleAssets: document.querySelector('tr.C1>td:nth-child(' + index + ') input'),
      /* 低值易耗品摊销 */
      LowValueConsumablesAmortization: document.querySelector('tr.C2>td:nth-child(' + index + ') input'),
      /* 修理费 */
      RepairFee: document.querySelector('tr.C3>td:nth-child(' + index + ') input'),
      /* 店面租金 */
      StoreRent: document.querySelector('tr.C5>td:nth-child(' + index + ') input'),
      /* 设备租金 */
      EquipmentRent: document.querySelector('tr.C6>td:nth-child(' + index + ') input'),
      /* 财产保险 */
      PropertyRent: document.querySelector('tr.C7>td:nth-child(' + index + ') input'),
      /* 租赁费 */
      RentalFees: document.querySelector('tr.C4>td:nth-child(' + index + ') input'),
      /* 设备费用 */
      EquipmentCost: document.querySelector('tr.C8>td:nth-child(' + index + ') input'),
    };
  },
  tableThreeCalculation(index) {
    /* 租赁费 */
    this.tableThree(index).RentalFees.value = (this.remSep(this.tableThree(index).StoreRent.value) + this.remSep(this.tableThree(index).EquipmentRent.value)).toLocaleString();
    /* 设备费用 */
    this.tableThree(index).EquipmentCost.value = (this.remSep(this.tableThree(index).Depreciation.value) + this.remSep(this.tableThree(index).AmortizationOfTangibleAssets.value) + this.remSep(this.tableThree(index).LowValueConsumablesAmortization.value) + this.remSep(this.tableThree(index).RepairFee.value) + this.remSep(this.tableThree(index).RentalFees.value) + this.remSep(this.tableThree(index).PropertyRent ? this.tableThree(index).PropertyRent.value : 0)).toLocaleString();
  },

  /* Type类型为3时 */
  tableFour(index) {
    return {
      /* 办公费-市话费 */
      CityCallFee: document.querySelector('tr.D1>td:nth-child(' + index + ') input'),
      /* 办公费-网络通讯费 */
      NetworkCommunicationFee: document.querySelector('tr.D2>td:nth-child(' + index + ') input'),
      /* 办公费-其他 */
      OfficeFeeOtherFee: document.querySelector('tr.D3>td:nth-child(' + index + ') input'),
      /* 办公费-办公用品 */
      OfficeSupplies: document.querySelector('tr.D4>td:nth-child(' + index + ') input'),
      /* 办公费-长话费 */
      LongDistanceFee: document.querySelector('tr.D5>td:nth-child(' + index + ') input'),
      /* 办公费-短信费 */
      SMSCharges: document.querySelector('tr.D6>td:nth-child(' + index + ') input'),
      /* 差旅费-市内交通费 */
      CityTransportationFee: document.querySelector('tr.D8>td:nth-child(' + index + ') input'),
      /* 差旅费-出差旅费 */
      TravelExpenses: document.querySelector('tr.D9>td:nth-child(' + index + ') input'),
      /* 印刷费 */
      PrintingFee: document.querySelector('tr.D11>td:nth-child(' + index + ') input'),
      /* 水电费 */
      UtilityFee: document.querySelector('tr.D12>td:nth-child(' + index + ') input'),
      /* 交际费 */
      CommunicationFee: document.querySelector('tr.D13>td:nth-child(' + index + ') input'),
      /* 产调 */
      ProductionAdjustment: document.querySelector('tr.D14>td:nth-child(' + index + ') input'),
      /* 审计费 */
      AuditFees: document.querySelector('tr.D15>td:nth-child(' + index + ') input'),
      /* 税金 */
      Tax: document.querySelector('tr.D16>td:nth-child(' + index + ') input'),
      /* 运费 */
      Freight: document.querySelector('tr.D17>td:nth-child(' + index + ') input'),
      /* 会费 */
      MembershipFee: document.querySelector('tr.D18>td:nth-child(' + index + ') input'),
      /* 书报费 */
      BookFee: document.querySelector('tr.D19>td:nth-child(' + index + ') input'),
      /* 坏账准备 */
      BadDebtProvision: document.querySelector('tr.D20>td:nth-child(' + index + ') input'),
      /* 技术顾问费 */
      TechnicalAdvisoryFee: document.querySelector('tr.D28>td:nth-child(' + index + ') input'),
      /* 规费 */
      Fees: document.querySelector('tr.D21>td:nth-child(' + index + ') input'),
      /* 中人费 */
      ZhongRenFee: document.querySelector('tr.D30>td:nth-child(' + index + ') input'),
      /* 诉讼费 */
      LitigationCosts: document.querySelector('tr.D23>td:nth-child(' + index + ') input'),
      /* 其他 */
      otherFee: document.querySelector('tr.D24>td:nth-child(' + index + ') input'),
      /* 办公费 */
      FourOfficeFee: document.querySelector('tr.D0>td:nth-child(' + index + ') input'),
      /* 差旅费 */
      FourTravelExpenses: document.querySelector('tr.D7>td:nth-child(' + index + ') input'),
      /* 事务费用 */
      TotalTransactionCost: document.querySelector('tr.D29>td:nth-child(' + index + ') input'),
    };
  },
  tableFourCalculation(index) {
    /* 办公费 */
    this.tableFour(index).FourOfficeFee.value = (this.remSep(this.tableFour(index).CityCallFee.value) + this.remSep(this.tableFour(index).NetworkCommunicationFee.value) + this.remSep(this.tableFour(index).OfficeSupplies.value) + this.remSep(this.tableFour(index).OfficeFeeOtherFee.value) + this.remSep(this.tableFour(index).LongDistanceFee.value) + this.remSep(this.tableFour(index).SMSCharges.value)).toLocaleString();
    /* 差旅费 */
    this.tableFour(index).FourTravelExpenses.value = (this.remSep(this.tableFour(index).CityTransportationFee.value) + this.remSep(this.tableFour(index).TravelExpenses.value)).toLocaleString();
    /* 事务费用 */
    this.tableFour(index).TotalTransactionCost.value = (this.remSep(this.tableFour(index).FourOfficeFee.value) + this.remSep(this.tableFour(index).FourTravelExpenses.value) + this.remSep(this.tableFour(index).PrintingFee.value) + this.remSep(this.tableFour(index).UtilityFee.value) + this.remSep(this.tableFour(index).CommunicationFee.value) + this.remSep(this.tableFour(index).ProductionAdjustment.value) + this.remSep(this.tableFour(index).AuditFees ? this.tableFour(index).AuditFees.value : 0) + this.remSep(this.tableFour(index).Tax ? this.tableFour(index).Tax.value : 0) + this.remSep(this.tableFour(index).Freight.value) + this.remSep(this.tableFour(index).MembershipFee ? this.tableFour(index).MembershipFee.value : 0) + this.remSep(this.tableFour(index).BookFee.value) + this.remSep(this.tableFour(index).BadDebtProvision ? this.tableFour(index).BadDebtProvision.value : 0) + this.remSep(this.tableFour(index).Fees ? this.tableFour(index).Fees.value : 0) + this.remSep(this.tableFour(index).LitigationCosts ? this.tableFour(index).LitigationCosts.value : 0) + this.remSep(this.tableFour(index).otherFee.value) + this.remSep(this.tableFour(index).ZhongRenFee ? this.tableFour(index).ZhongRenFee.value : 0) + this.remSep(this.tableFour(index).TechnicalAdvisoryFee ? this.tableFour(index).TechnicalAdvisoryFee.value : 0)).toLocaleString();
  },

  /* Type类型为4时 */
  tableFive(index) {
    return {
      /* 广告费-案源-派报 */
      AdvertisingFeeCaseSourceReport: document.querySelector('tr.E1>td:nth-child(' + index + ') input'),
      /* 广告费-案源-看板横幅 */
      AdvertisingFeeCaseSourceKanbanBanner: document.querySelector('tr.E4>td:nth-child(' + index + ') input'),
      /* 广告费-案源-其他 */
      AdvertisingFeeCaseSourceOther: document.querySelector('tr.E5>td:nth-child(' + index + ') input'),
      /* 行销费-促销活动 */
      MarketingFeePromotions: document.querySelector('tr.E11>td:nth-child(' + index + ') input'),
      /* 行销费-设计制作 */
      MarketingFeeDesignProduction: document.querySelector('tr.E13>td:nth-child(' + index + ') input'),
      /* 行销费-其他 */
      MarketingFeeOther: document.querySelector('tr.E15>td:nth-child(' + index + ') input'),
      /* 广告费 */
      AdvertisingFee: document.querySelector('tr.E0>td:nth-child(' + index + ') input'),
      /* 行销费 */
      MarketingFee: document.querySelector('tr.E16>td:nth-child(' + index + ') input'),
      /* 行销費用 */
      TotalMarketingFee: document.querySelector('tr.E20>td:nth-child(' + index + ') input'),
    };
  },
  tableFiveCalculation(index) {
    /* 广告费 */
    this.tableFive(index).AdvertisingFee.value = (this.remSep(this.tableFive(index).AdvertisingFeeCaseSourceReport.value) + this.remSep(this.tableFive(index).AdvertisingFeeCaseSourceKanbanBanner.value) + this.remSep(this.tableFive(index).AdvertisingFeeCaseSourceOther.value)).toLocaleString();
    /* 行销费 */
    this.tableFive(index).MarketingFee.value = (this.remSep(this.tableFive(index).MarketingFeePromotions.value) + this.remSep(this.tableFive(index).MarketingFeeDesignProduction.value) + this.remSep(this.tableFive(index).MarketingFeeOther.value)).toLocaleString();
    /* 行销費用 */
    this.tableFive(index).TotalMarketingFee.value = (this.remSep(this.tableFive(index).AdvertisingFee.value) + this.remSep(this.tableFive(index).MarketingFee.value)).toLocaleString();
  },

  /* Type类型为5时 */
  tableSix(index) {
    return {
      /* 管理服务费 */
      ManagementServiceFee: document.querySelector('tr.F1>td:nth-child(' + index + ') input'),
      /* 归属费用 */
      OwnershipFee: document.querySelector('tr.F2>td:nth-child(' + index + ') input'),
      /* 營業支出 */
      OperatingExpenses: document.querySelector('tr.F0>td:nth-child(' + index + ') input'),
      /* 签约金损益 */
      SigningFeeProfitAndLoss: document.querySelector('tr.F3>td:nth-child(' + index + ') input'),
      /* 签约金损益收益率 */
      ContractedFeeProfitAndLossYield: document.querySelector('tr.F4>td:nth-child(' + index + ') input'),
    };
  },
  tableSixCalculation(index) {
    /* 营业支出 */
    this.tableSix(index).OperatingExpenses.value = (this.remSep(this.tableTwo(index).EmploymentFee.value) + this.remSep(this.tableThree(index).EquipmentCost.value) + this.remSep(this.tableFour(index).TotalTransactionCost.value) + this.remSep(this.tableFive(index).TotalMarketingFee.value)).toLocaleString();
    /* 管理服务费 */
    // TODO:这里着重测试一下；
    if (this.fromWhere === 'yearIndex') {
      // this.tableSix(index).ManagementServiceFee.value = (ber(Number(this.remSep(this.tableOne(index).OriginalContractFee.value)) * Number(this.getVueSigningRatio['SigningRatio' + (index - 2)]) + 12000).toFixed(2)).toLocaleString();
      if (this.tableSix(index).ManagementServiceFee && this.department !== 'A2') {
        this.tableSix(index).ManagementServiceFee.value = Math.round(this.remSep(this.tableOne(index).OriginalContractFee.value) * Number(this.VueSigningRatio['SigningRatio' + (index - 2)]) + 12000).toLocaleString();
      }
    } else if (this.tableSix(index).ManagementServiceFee && this.department !== 'A2') {
      this.tableSix(index).ManagementServiceFee.value = Math.round(this.remSep(this.tableOne(index).OriginalContractFee.value) * Number(this.VueSigningRatio) + 12000).toLocaleString();
    }

    /* 签约金损益 */
    // this.tableSix(index).SigningFeeProfitAndLoss.value = ((Number(this.remSep(this.tableOne(index).OperatingNetProfit.value)) - Number(this.remSep(this.tableSix(index).OperatingExpenses.value)) - Number(this.remSep(this.tableSix(index).ManagementServiceFee.value))).toFixed(2)).toLocaleString();
    if (this.tableSix(index).SigningFeeProfitAndLoss) {
      // TODO:代码改过之后,这里出问题了;
      // console.log(this.tableSix(index));
      // console.log(this.tableSix(index).SigningFeeProfitAndLoss);
      // TODO:区部的服务管理费呢??
      // console.log((this.remSep(this.tableOne(index).OperatingNetProfit.value) - this.remSep(this.tableSix(index).OperatingExpenses.value) - this.remSep(this.tableSix(index).ManagementServiceFee.value) - this.remSep(this.tableSix(index).OwnershipFee ? this.tableSix(index).OwnershipFee.value : 0)));
      this.tableSix(index).SigningFeeProfitAndLoss.value = (this.remSep(this.tableOne(index).OperatingNetProfit.value) - this.remSep(this.tableSix(index).OperatingExpenses.value) - this.remSep(this.tableSix(index).ManagementServiceFee ? this.tableSix(index).ManagementServiceFee.value : 0) - this.remSep(this.tableSix(index).OwnershipFee ? this.tableSix(index).OwnershipFee.value : 0)).toLocaleString();
    }

    /* 签约金损益收益率 */
    if (this.tableSix(index).ContractedFeeProfitAndLossYield && Number(this.remSep(this.tableOne(index).TotalIncome.value)) !== 0) {
      // this.tableSix(index).ContractedFeeProfitAndLossYield.value = ((Number(this.remSep(this.tableSix(index).SigningFeeProfitAndLoss.value)) / Number(this.remSep(this.tableOne(index).TotalIncome.value))).toFixed(2)).toLocaleString();
      this.tableSix(index).ContractedFeeProfitAndLossYield.value = this.addPercent((this.remSep(this.tableSix(index).SigningFeeProfitAndLoss.value) / this.remSep(this.tableOne(index).TotalIncome.value)));
    }
  },

  /* Type类型为6时 */
  tableSeven(index) {
    return {
      /* 业绩 */
      Performance: document.querySelector('tr.G0>td:nth-child(' + index + ') input'),
      /* 业绩损益 */
      PerformanceGainsAndLosses: document.querySelector('tr.G1>td:nth-child(' + index + ') input'),
      /* 业绩损益收益率 */
      PerformanceGainsAndLossesRate: document.querySelector('tr.G2>td:nth-child(' + index + ') input'),
    };
  },
  tableSevenCalculation(index) {
    /* 业绩损益 */
    // this.tableSeven(index).PerformanceGainsAndLosses.value = ((Number(this.remSep(this.tableSeven(index).Performance.value)) - Number(this.remSep(this.tableSix(index).ManagementServiceFee.value)) - Number(this.remSep(this.tableSix(index).OperatingExpenses.value)) - Number(this.remSep(this.tableOne(index).BusinessTax.value))).toFixed(2)).toLocaleString();
    if (this.tableSeven(index).PerformanceGainsAndLosses) {
      this.tableSeven(index).PerformanceGainsAndLosses.value = (this.remSep(this.tableSeven(index).Performance.value) - this.remSep(this.tableSix(index).ManagementServiceFee ? this.tableSix(index).ManagementServiceFee.value : 0) - this.remSep(this.tableSix(index).OperatingExpenses.value) - this.remSep(this.tableOne(index).BusinessTax.value)).toLocaleString();
    }
    /* 业绩损益收益率 */
    if (this.tableSeven(index).PerformanceGainsAndLossesRate && Number(this.tableSeven(index).Performance.value) !== 0) {
      // this.tableSeven(index).PerformanceGainsAndLossesRate.value = ((Number(this.remSep(this.tableSeven(index).PerformanceGainsAndLosses.value)) / Number(this.remSep(this.tableSeven(index).Performance.value))).toFixed(2)).toLocaleString();
      this.tableSeven(index).PerformanceGainsAndLossesRate.value = this.addPercent((this.remSep(this.tableSeven(index).PerformanceGainsAndLosses.value) / this.remSep(this.tableSeven(index).Performance.value)));
    }
  },

  /* Type类型为7时 */
  tableEight(index) {
    return {
      /* 单位时间损益 */
      UnitTimeProfitAndLoss: document.querySelector('tr.H1>td:nth-child(' + index + ') input'),
      /* 出勤时间 */
      AttendanceTime: document.querySelector('tr.H0>td:nth-child(' + index + ') input'),
    };
  },
  tableEightCalculation(index) {
    /* 单位时间损益 */
    if (this.tableEight(index).UnitTimeProfitAndLoss && Number(this.tableEight(index).AttendanceTime.value) !== 0) {
      this.tableEight(index).UnitTimeProfitAndLoss.value = this.addPercent((this.remSep(this.tableSix(index).SigningFeeProfitAndLoss.value) / this.remSep(this.tableEight(index).AttendanceTime.value)));
    }
  },
  // 去处千分位符号；
  remSep(val) {
    if (val === '' || val === 0) {
      return 0;
    }
    const num = val.split(',');
    return parseFloat(num.join(''));
  },
  // 增加千分位；
  calAddSep(event) {
    const currentEl = event.target;
    if (currentEl.value !== '') {
      currentEl.value = this.remSep(currentEl.value).toLocaleString();
    }
  },

  addPercent(val) {
    return Math.round(val * 100) + '%';
  },

  remPercent(val) {
    return parseFloat(val) / 100;
  },

  allInputEl(el) {
    return document.querySelectorAll('table.commonTable tr.' + el.className + ' input');
  },

  allTableCalculation(index) {
    /* oneTable  start ! */
    this.tableOneCalculation(index);
    /* oneTable  end ! */

    /* twoTable 开始 */
    this.tableTwoCalculation(index);
    /* twoTable end */

    /* threeTable 开始 */
    this.tableThreeCalculation(index);
    /* threeTable end */

    /* fourTable 开始 */
    this.tableFourCalculation(index);
    /* fourTable end */

    /* fiveTable 开始 */
    this.tableFiveCalculation(index);
    /* fiveTable end */

    /* sixTable 开始 */
    this.tableSixCalculation(index);
    /* sixTable end */

    /* sevenTable 开始 */
    this.tableSevenCalculation(index);
    /* sevenTable end */

    /* eightTable 开始 */
    this.tableEightCalculation(index);
    /* eightTable end */
  },
  toggleSubject(event) {
    const toggleChildNodes = event.target.parentNode.parentNode.parentNode.nextSibling.childNodes;
    const toggleChildNodesLen = toggleChildNodes.length;
    const isF5 = toggleChildNodes[0].getAttribute('class').indexOf('F') !== -1;
    if (toggleChildNodesLen > 1) {
      if (event.target.getAttribute('class') === 'el-icon-arrow-down') {
        Vue.nextTick(() => {
          if (!isF5) {
            for (let i = 0; i < toggleChildNodesLen - 1; i += 1) {
              toggleChildNodes[i].classList.add('toggle-subject');
            }
          } else {
            for (let i = 0; i < toggleChildNodesLen - 2; i += 1) {
              toggleChildNodes[i].classList.add('toggle-subject');
            }
          }
        });
        event.target.setAttribute('class', 'el-icon-arrow-up');
      } else {
        Vue.nextTick(() => {
          if (!isF5) {
            for (let i = 0; i < toggleChildNodesLen - 1; i += 1) {
              toggleChildNodes[i].classList.remove('toggle-subject');
            }
          } else {
            for (let i = 0; i < toggleChildNodesLen - 2; i += 1) {
              toggleChildNodes[i].classList.remove('toggle-subject');
            }
          }
        });
        event.target.setAttribute('class', 'el-icon-arrow-down');
      }
    }
  },
};
