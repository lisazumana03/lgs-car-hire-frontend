/*
Sibulele Nohamba
220374686
Date: 21/08/2025
 */

import axios from "axios";
import { getAuthToken } from "./authService.js";

const API_URL = "http://localhost:3046/api/insurance";

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

export const createInsurance = (insurance) => {
    return axios.post(`${API_URL}/create`, insurance, getConfig());
}

export const readInsurance = (id) => {
    return axios.get(`${API_URL}/read/${id}`, getConfig());
}

export const updateInsurance = (insurance) => {
    return axios.put(`${API_URL}/update`, insurance, getConfig());
}

export const deleteInsurance = (id) => {
    return axios.delete(`${API_URL}/delete/${id}`, getConfig());
}

export const cancelInsurance = (id) => {
    return axios.delete(`${API_URL}/cancel/${id}`, getConfig());
}

export const getAllInsurance = () => {
    return axios.get(`${API_URL}/all`, getConfig());
};
