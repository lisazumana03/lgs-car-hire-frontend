/**
 * Insurance Service
 * Sibulele Nohamba
 * 220374686
 * Date: 21/08/2025
 * Converted to TypeScript
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken } from './authService';
import type { Insurance, InsuranceRequest } from '../types';

const API_URL = 'http://localhost:3045/api/insurance';

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

export const createInsurance = (insurance: InsuranceRequest): Promise<AxiosResponse<Insurance>> => {
  return axios.post(`${API_URL}/create`, insurance, getConfig());
};

export const readInsurance = (id: string): Promise<AxiosResponse<Insurance>> => {
  return axios.get(`${API_URL}/read/${id}`, getConfig());
};

export const updateInsurance = (insurance: Insurance): Promise<AxiosResponse<Insurance>> => {
  return axios.put(`${API_URL}/update`, insurance, getConfig());
};

export const deleteInsurance = (id: string): Promise<AxiosResponse<void>> => {
  return axios.delete(`${API_URL}/delete/${id}`, getConfig());
};

export const cancelInsurance = (id: string): Promise<AxiosResponse<void>> => {
  return axios.delete(`${API_URL}/cancel/${id}`, getConfig());
};

export const getAllInsurance = (): Promise<AxiosResponse<Insurance[]>> => {
  return axios.get(`${API_URL}/all`, getConfig());
};
