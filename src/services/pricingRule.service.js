import axios from "axios";

const API_URL = "http://localhost:3045/api/pricing-rule";

export const createPricingRule = (pricingRule) => {
  return axios.post(`${API_URL}/create`, pricingRule);
};

export const getPricingRuleById = (pricingRuleId) => {
  return axios.get(`${API_URL}/read/${pricingRuleId}`);
};

export const updatePricingRule = (pricingRule) => {
  return axios.put(`${API_URL}/update`, pricingRule);
};

export const deletePricingRule = (pricingRuleId) => {
  return axios.delete(`${API_URL}/delete/${pricingRuleId}`);
};

export const getAllPricingRules = () => {
  return axios.get(`${API_URL}/all`);
};

export const getActivePricingRules = () => {
  return axios.get(`${API_URL}/active`);
};

export const getPricingRulesByCarType = (carTypeId) => {
  return axios.get(`${API_URL}/car-type/${carTypeId}`);
};

export const getActivePricingRuleForCarType = (carTypeId) => {
  return axios.get(`${API_URL}/car-type/${carTypeId}/active`);
};

export const calculatePrice = (carTypeId, days, rentalDate = null) => {
  const params = { carTypeId, days };
  if (rentalDate) {
    params.rentalDate = rentalDate;
  }
  return axios.get(`${API_URL}/calculate-price`, { params });
};

export const getPricingRulesValidOnDate = (date) => {
  return axios.get(`${API_URL}/valid-on/${date}`);
};
