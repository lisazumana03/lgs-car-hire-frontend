import axios from "axios";

const API_URL = "http://localhost:3045/api/review";

export const create = (review) => {
  return axios.post(`${API_URL}/create`, review);
};

export const getAllTickects = () => {
  return axios.get(API_URL);
};

export const updateSupportTicket = (review) => {
  return axios.put(`${API_URL}`, review);
};

export const deleteSupportTicket = (reviewID) => {
  return axios.delete(`${API_URL}/${reviewID}`);
};

export const cancelSupportTicket = (reviewID) => {
  return axios.delete(`${API_URL}/${reviewID}`);
};
