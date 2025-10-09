/**
 * Car Type Service
 * Imtiyaaz Waggie 219374759
 * Car Type Service for managing car types
 * Updated: 10/09/2025 - Added JWT support
 * Converted to TypeScript
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken } from './authService';
import type { CarType, CarTypeRequest } from '../types';

const API_URL = 'http://localhost:3045/api/cartype';

// Helper to add auth header
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

export const createCarType = (carType: CarTypeRequest): Promise<AxiosResponse<CarType>> => {
  return axios.post(`${API_URL}/create`, carType, getConfig());
};

export const getCarTypeById = (carTypeId: string): Promise<AxiosResponse<CarType>> => {
  return axios.get(`${API_URL}/read/${carTypeId}`, getConfig());
};

export const updateCarType = (carType: CarType): Promise<AxiosResponse<CarType>> => {
  return axios.put(`${API_URL}/update`, carType, getConfig());
};

export const deleteCarType = (carTypeId: string): Promise<AxiosResponse<void>> => {
  return axios.delete(`${API_URL}/delete/${carTypeId}`, getConfig());
};

export const getAllCarTypes = (): Promise<AxiosResponse<CarType[]>> => {
  return axios.get(`${API_URL}/all`, getConfig());
};

export const getCarTypesByFuelType = (fuelType: string): Promise<AxiosResponse<CarType[]>> => {
  return axios.get(`${API_URL}/fuel/${fuelType}`, getConfig());
};
