/*
Imtiyaaz Waggie 219374759
Car Type Service for managing car types
Updated: 10/09/2025 - Added JWT support
*/

import axios from "axios";
import { getAuthToken } from "./authService.js";

const API_URL = "http://localhost:3045/api/car-type";

// Helper to add auth header
const getConfig = () => {
  const token = getAuthToken();
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const createCarType = (carType) => {
  return axios.post(`${API_URL}/create`, carType, getConfig());
};

export const getCarTypeById = (carTypeId) => {
  return axios.get(`${API_URL}/read/${carTypeId}`, getConfig());
};

export const updateCarType = (carType) => {
  return axios.put(`${API_URL}/update`, carType, getConfig());
};

export const deleteCarType = (carTypeId) => {
  return axios.delete(`${API_URL}/delete/${carTypeId}`, getConfig());
};

export const getAllCarTypes = () => {
  return axios.get(`${API_URL}/all`, getConfig());
};

export const getCarTypesByFuelType = (fuelType) => {
  return axios.get(`${API_URL}/fuel/${fuelType}`, getConfig());
};
