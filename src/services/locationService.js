/**
Lisakhanya Zumana (230864821)
Date: 14/08/2025
 */
import axios from "axios";

const API_URL = "http://localhost:3045/api/location";

export const create = (location) => {
  return axios.post(`${API_URL}/create`, location);
};

export const getAllLocations = () => {
  return axios.get(API_URL);
};

export const updateLocation = (location) => {
  return axios.put(`${API_URL}/update`, location);
};

export const deleteLocation = (locationId) => {
  return axios.delete(`${API_URL}/delete/${locationId}`);
};
