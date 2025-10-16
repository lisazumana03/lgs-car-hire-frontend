import axios from "axios";

const API_URL = "http://localhost:3045/api/car-type";

export const createCarType = (carType) => {
  return axios.post(`${API_URL}/create`, carType);
};

export const getCarTypeById = (carTypeId) => {
  return axios.get(`${API_URL}/read/${carTypeId}`);
};

export const updateCarType = (carType) => {
  return axios.put(`${API_URL}/update`, carType);
};

export const deleteCarType = (carTypeId) => {
  return axios.delete(`${API_URL}/delete/${carTypeId}`);
};

export const getAllCarTypes = () => {
  return axios.get(`${API_URL}/all`);
};

export const getCarTypesByFuelType = (fuelType) => {
  return axios.get(`${API_URL}/fuel/${fuelType}`);
};