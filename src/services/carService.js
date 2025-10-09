/*
Imtiyaaz Waggie 219374759
Updated: 10/09/2025 - Added JWT support
 */

import axios from "axios";
import { getAuthToken } from "./authService.js";

const API_URL = "http://localhost:3045/api/car";

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

export const create = (car) => {
  return axios.post(`${API_URL}/create`, car, getConfig());
};

export const getCarById = (carId) => {
  return axios.get(`${API_URL}/read/${carId}`, getConfig());
};

export const updateCar = (car) => {
  return axios.put(`${API_URL}/update`, car, getConfig());
};

export const deleteCar = (carId) => {
  return axios.delete(`${API_URL}/delete/${carId}`, getConfig());
};

export const getAllCars = () => {
  return axios.get(`${API_URL}/all`, getConfig());
};

export const getCarsByBrand = (brand) => {
  return axios.get(`${API_URL}/brand/${brand}`, getConfig());
};

export const getAvailableCars = () => {
  return axios.get(`${API_URL}/available`, getConfig());
};

export const getCarsByYear = (year) => {
  return axios.get(`${API_URL}/year/${year}`, getConfig());
};

export const getCarsByPriceRange = (minPrice, maxPrice) => {
  return axios.get(`${API_URL}/price-range`, {
    params: { minPrice, maxPrice },
    ...getConfig(),
  });
};

export const updateCarAvailability = (carId, available) => {
  return axios.put(`${API_URL}/availability/${carId}`, null, {
    params: { available },
    ...getConfig(),
  });
};
