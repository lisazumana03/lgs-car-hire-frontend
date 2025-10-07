/*
Sibulele Nohamba
220374686
Date: 20/08/2025
Updated to match backend MaintenanceController endpoints
*/

import axios from "axios";

const API_URL = "http://localhost:3045/maintenance";

// Create maintenance (POST /api/maintenance/create)
export const createMaintenance = (maintenance) => {
  return axios.post(`${API_URL}/create`, maintenance);
};

// Read maintenance by ID (GET /api/maintenance/read/{id})
export const readMaintenance = (id) => {
  return axios.get(`${API_URL}/read/${id}`);
};

// Update maintenance (PUT /api/maintenance/update/{id})
export const updateMaintenance = (id, maintenance) => {
  return axios.put(`${API_URL}/update/${id}`, maintenance);
};

// Delete maintenance (DELETE /api/maintenance/delete/{id})
export const deleteMaintenance = (id) => {
  return axios.delete(`${API_URL}/delete/${id}`);
};

// Get all maintenance records (GET /api/maintenance/all)
export const getAllMaintenance = () => {
  return axios.get(`${API_URL}/all`);
};

export default {
  createMaintenance,
  readMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getAllMaintenance,
};
