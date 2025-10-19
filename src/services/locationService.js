/*
Lisakhanya Zumana (230864821)
Date: 14/08/2025
 */
import apiClient from "../scripts/apiConfig";

const API_URL = "http://localhost:3045/api/location";

export const create = (location) => {
  return apiClient.post(`${API_URL}/create`, location);
};

export const getAllLocations = () => {
  return apiClient.get(`${API_URL}/all`);
};

export const getLocationByProvinceOrState = (provinceOrState) => {
  return apiClient.get(`${API_URL}/province-or-state/${provinceOrState}`);
};

export const updateLocation = (location) => {
  return apiClient.put(`${API_URL}/update`, location);
};

export const deleteLocation = (locationId) => {
  return apiClient.delete(`${API_URL}/delete/${locationId}`);
};
