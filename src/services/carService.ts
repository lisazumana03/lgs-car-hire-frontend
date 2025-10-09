/**
 * Car Service
 * Imtiyaaz Waggie 219374759
 * Updated: 10/09/2025 - Added JWT support
 * Converted to TypeScript
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken } from './authService';
import type { Car, CarRequest } from '../types';

const API_URL = 'http://localhost:3045/api/car';

const getConfig = (): AxiosRequestConfig => {
  const token = getAuthToken();
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const create = (car: CarRequest): Promise<AxiosResponse<Car>> => {
  return axios.post(`${API_URL}/create`, car, getConfig());
};

export const getCarById = (carId: string): Promise<AxiosResponse<Car>> => {
  return axios.get(`${API_URL}/read/${carId}`, getConfig());
};

export const updateCar = (car: Car): Promise<AxiosResponse<Car>> => {
  return axios.put(`${API_URL}/update`, car, getConfig());
};

export const deleteCar = (carId: string): Promise<AxiosResponse<void>> => {
  return axios.delete(`${API_URL}/delete/${carId}`, getConfig());
};

export const getAllCars = (): Promise<AxiosResponse<Car[]>> => {
  return axios.get(`${API_URL}/all`, getConfig());
};

export const getCarsByBrand = (brand: string): Promise<AxiosResponse<Car[]>> => {
  return axios.get(`${API_URL}/brand/${brand}`, getConfig());
};

export const getAvailableCars = (): Promise<AxiosResponse<Car[]>> => {
  return axios.get(`${API_URL}/available`, getConfig());
};

export const getCarsByYear = (year: number): Promise<AxiosResponse<Car[]>> => {
  return axios.get(`${API_URL}/year/${year}`, getConfig());
};

export const getCarsByPriceRange = (minPrice: number, maxPrice: number): Promise<AxiosResponse<Car[]>> => {
  return axios.get(`${API_URL}/price-range`, {
    params: { minPrice, maxPrice },
    ...getConfig(),
  });
};

export const updateCarAvailability = (carId: string, available: boolean): Promise<AxiosResponse<Car>> => {
  return axios.put(`${API_URL}/availability/${carId}`, null, {
    params: { available },
    ...getConfig(),
  });
};
