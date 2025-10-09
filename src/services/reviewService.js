import axios from "axios";
import { getAuthToken } from "./authService.js";

const API_URL = "http://localhost:3045/review";

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

export const create = (review) => {
    return axios.post(`${API_URL}/create`, review, getConfig());
}

export const getAllTickects = () => {
    return axios.get(API_URL, getConfig());
}

export const updateSupportTicket = (review) => {
    return axios.put(`${API_URL}`, review, getConfig());
}

export const deleteSupportTicket = (reviewID) => {
    return axios.delete(`${API_URL}/${reviewID}`, getConfig());
}

export const cancelSupportTicket = (reviewID) => {
    return axios.delete(`${API_URL}/${reviewID}`, getConfig());
}