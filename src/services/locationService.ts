/**
 * Location Service
 * Lisakhanya Zumana (230864821)
 * Date: 14/08/2025
 * Updated: 10/09/2025 - Added JWT support
 * Converted to TypeScript
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken } from './authService';
import type { Location, LocationRequest } from '../types';

const API_URL = 'http://localhost:3045/api/location';

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

export const create = (location: LocationRequest): Promise<AxiosResponse<Location>> => {
  return axios.post(`${API_URL}/create`, location, getConfig());
};

export const getAllLocations = (): Promise<AxiosResponse<Location[]>> => {
  return axios.get(`${API_URL}/all`, getConfig());
};

export const getLocationById = (id: string): Promise<AxiosResponse<Location>> => {
  return axios.get(`${API_URL}/read/${id}`, getConfig());
};

export const getLocationByProvinceOrState = (provinceOrState: string): Promise<AxiosResponse<Location[]>> => {
  return axios.get(`${API_URL}/province-or-state/${provinceOrState}`, getConfig());
};

export const updateLocation = (location: Location): Promise<AxiosResponse<Location>> => {
  return axios.put(`${API_URL}/update`, location, getConfig());
};

export const deleteLocation = (locationId: string): Promise<AxiosResponse<void>> => {
  return axios.delete(`${API_URL}/delete/${locationId}`, getConfig());
};
