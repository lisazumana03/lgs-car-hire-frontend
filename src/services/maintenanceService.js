/*
Sibulele Nohamba
220374686
Date: 20/08/2025
 */

import axios from "axios";
import { getAuthToken } from "./authService.js";

const API_URL = "http://localhost:3046/api/maintenance";

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

export const createMaintenance = (maintenance) => {
    return axios.post(`${API_URL}/create`, maintenance, getConfig());
}

export const readMaintenance = (id) => {
    return axios.get(`${API_URL}/read/${id}`, getConfig());
}

export const updateMaintenance = (maintenance) => {
    return axios.put(`${API_URL}/update`, maintenance, getConfig());
}

export const deleteMaintenance = (id) => {
    return axios.delete(`${API_URL}/delete/${id}`, getConfig());
}

export const cancelMaintenance = (id) => {
    return axios.delete(`${API_URL}/cancel/${id}`, getConfig());
}

export const getAllMaintenance = () => {
    return axios.get(`${API_URL}/all`, getConfig());
};
