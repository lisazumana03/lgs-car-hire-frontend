/*
Sibulele Nohamba
220374686
Date: 31/08/2025
 */
import axios from "axios";

const API_URL = "http://localhost:3046/api/maintenance";

export const createMaintenance = (maintenance) => {
    return axios.post(`${API_URL}/create`, maintenance);
}

export const readMaintenance = (id) => {
    return axios.get(`${API_URL}/read/${id}`);
}

export const updateMaintenance = (maintenance) => {
    return axios.put(`${API_URL}/update`, maintenance);
}

export const deleteMaintenance = (id) => {
    return axios.delete(`${API_URL}/delete/${id}`);
}

export const cancelMaintenance = (id) => {
    return axios.delete(`${API_URL}/cancel/${id}`);
}

export const getAllMaintenance = () => {
    return axios.get(`${API_URL}/all`);
};

export const getMaintenanceById = readMaintenance;
