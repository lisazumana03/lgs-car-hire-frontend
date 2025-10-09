import axios from "axios";
import { getAuthToken } from "./authService.js";

const API_URL = "http://localhost:3045/support";

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

export const create = (support) => {
    return axios.post(`${API_URL}/create`, support, getConfig());
}

export const getAllTickects = () => {
    return axios.get(API_URL, getConfig());
}

export const updateSupportTicket = (support) => {
    return axios.put(`${API_URL}`, support, getConfig());
}

export const deleteSupportTicket = (supportId) => {
    return axios.delete(`${API_URL}/${supportId}`, getConfig());
}

export const cancelSupportTicket = (supportId) => {
    return axios.delete(`${API_URL}/${supportId}`, getConfig());
}