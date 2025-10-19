/*
Imtiyaaz Waggie 219374759
Car Type Service for managing car types
*/

import apiClient from "../scripts/apiConfig";

const API_URL = "http://localhost:3045/api/car-type";

export const createCarType = (carType) => {
  return apiClient.post(`${API_URL}/create`, carType);
};

export const getCarTypeById = (carTypeId) => {
  return apiClient.get(`${API_URL}/read/${carTypeId}`);
};

export const updateCarType = (carType) => {
  return apiClient.put(`${API_URL}/update`, carType);
};

export const deleteCarType = (carTypeId) => {
  return apiClient.delete(`${API_URL}/delete/${carTypeId}`);
};

export const getAllCarTypes = () => {
  return apiClient.get(`${API_URL}/all`);
};

export const getCarTypesByFuelType = (fuelType) => {
  return apiClient.get(`${API_URL}/fuel/${fuelType}`);
};
