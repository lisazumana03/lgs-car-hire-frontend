/*
Imtiyaaz Waggie 219374759
 */

import axios from "axios";

const API_URL = "http://localhost:3045/api/car";

export const create = (car) => {
  return axios.post(`${API_URL}/create`, car);
};

export const getCarById = (carId) => {
  return axios.get(`${API_URL}/read/${carId}`);
};

export const updateCar = (car) => {
  return axios.put(`${API_URL}/update`, car);
};

export const deleteCar = (carId) => {
  return axios.delete(`${API_URL}/delete/${carId}`);
};

export const getAllCars = () => {
  return axios.get(`${API_URL}/all`);
};

export const getCarsByBrand = (brand) => {
  return axios.get(`${API_URL}/brand/${brand}`);
};

export const getAvailableCars = () => {
  return axios.get(`${API_URL}/available`);
};

export const getCarsByYear = (year) => {
  return axios.get(`${API_URL}/year/${year}`);
};

export const getCarsByPriceRange = (minPrice, maxPrice) => {
  return axios.get(`${API_URL}/price-range`, {
    params: { minPrice, maxPrice },
  });
};

export const updateCarAvailability = (carId, available) => {
  return axios.put(`${API_URL}/availability/${carId}`, null, {
    params: { available },
  });
};

export const uploadCarImage = (carId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  return axios.post(`${API_URL}/${carId}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
