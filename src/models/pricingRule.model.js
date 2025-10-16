/**
 * @typedef {Object} PricingRule
 * @property {number} pricingRuleID
 * @property {number} carTypeID
 * @property {string} carTypeName
 * @property {number} baseDailyRate
 * @property {number} weeklyRate
 * @property {number} monthlyRate
 * @property {number} weekendRate
 * @property {number} seasonalMultiplier
 * @property {string} validFrom - ISO date string
 * @property {string} validTo - ISO date string
 * @property {boolean} active
 */

export const calculateRentalPrice = (pricingRule, days, startDate = new Date()) => {
  if (!pricingRule || !pricingRule.active) {
    return 0;
  }

  let totalPrice = 0;

  if (days >= 30 && pricingRule.monthlyRate > 0) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    totalPrice = (months * pricingRule.monthlyRate) + (remainingDays * pricingRule.baseDailyRate);
  } else if (days >= 7 && pricingRule.weeklyRate > 0) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    totalPrice = (weeks * pricingRule.weeklyRate) + (remainingDays * pricingRule.baseDailyRate);
  } else {
    totalPrice = days * pricingRule.baseDailyRate;
  }

  if (pricingRule.seasonalMultiplier && pricingRule.seasonalMultiplier !== 1.0) {
    totalPrice *= pricingRule.seasonalMultiplier;
  }

  return totalPrice;
};

export const formatCurrency = (amount, currency = 'R') => {
  return `${currency}${amount.toFixed(2)}`;
};

export const getDailyRate = (pricingRule) => {
  if (!pricingRule) return 0;
  return pricingRule.baseDailyRate * (pricingRule.seasonalMultiplier || 1.0);
};

export const getWeeklyRate = (pricingRule) => {
  if (!pricingRule || !pricingRule.weeklyRate) return 0;
  return pricingRule.weeklyRate * (pricingRule.seasonalMultiplier || 1.0);
};

export const getMonthlyRate = (pricingRule) => {
  if (!pricingRule || !pricingRule.monthlyRate) return 0;
  return pricingRule.monthlyRate * (pricingRule.seasonalMultiplier || 1.0);
};
