/*
Lisakhanya Zumana (230864821)
Date: 14/08/2025
Updated: 10/09/2025 - Added JWT support
 */
import axios from "axios";
import { getAuthToken } from "./authService.js";

const API_URL = "http://localhost:3045/api/location";

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

export const create = (location) => {
    return axios.post(`${API_URL}/create`, location, getConfig());
}

export const getAllLocations = () => {
    return axios.get(`${API_URL}/all`, getConfig());
}

export const getLocationById = (id) => {
    return axios.get(`${API_URL}/read/${id}`, getConfig());
}

export const getLocationByProvinceOrState = (provinceOrState) => {
    return axios.get(`${API_URL}/province-or-state/${provinceOrState}`, getConfig());
}

export const updateLocation = (location) => {
    return axios.put(`${API_URL}/update`, location, getConfig());
}

export const deleteLocation = (locationId) => {
    return axios.delete(`${API_URL}/delete/${locationId}`, getConfig());
}