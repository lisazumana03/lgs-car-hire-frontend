/*
Sibulele Nohamba
220374686
Date: 21/08/2025
Updated to match backend InsuranceController endpoints
*/

import apiClient from "../scripts/apiConfig";

const API_URL = "http://localhost:3045/api/insurance";

// Create insurance (POST /api/insurance)
export const createInsurance = (insurance) => {
  return apiClient.post(API_URL, insurance);
};

// Read insurance by ID (GET /api/insurance/{id})
export const readInsurance = (id) => {
  return apiClient.get(`${API_URL}/${id}`);
};

// Get insurance by ID (alias for readInsurance)
export const getInsuranceById = (id) => {
  return apiClient.get(`${API_URL}/${id}`);
};

// Update insurance (PUT /api/insurance/{id})
export const updateInsurance = (id, insurance) => {
  return apiClient.put(`${API_URL}/${id}`, insurance);
};

// Delete insurance (DELETE /api/insurance/{id})
export const deleteInsurance = (id) => {
  return apiClient.delete(`${API_URL}/${id}`);
};

// Get all insurances (GET /api/insurance)
export const getAllInsurance = () => {
  return apiClient.get(API_URL);
};

// Get all insurances (alias)
export const getAllInsurances = () => {
  return apiClient.get(API_URL);
};

export default {
  createInsurance,
  readInsurance,
  getInsuranceById,
  updateInsurance,
  deleteInsurance,
  getAllInsurance,
  getAllInsurances,
};
