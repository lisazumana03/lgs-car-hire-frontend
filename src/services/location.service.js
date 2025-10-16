/*
Lisakhanya Zumana
230864821
 */
import axios from "axios";

const API_URL = "http://localhost:3045/api/location";

export const create = (location) => {
    return axios.post(`${API_URL}/create`, location);
}

export const getAllLocations = () => {
    return axios.get(`${API_URL}/all`);
}

export const getLocationByProvinceOrState = (provinceOrState) => {
    return axios.get(`${API_URL}/province-or-state/${provinceOrState}`);
}

export const updateLocation = (location) => {
    return axios.put(`${API_URL}/update`, location);
}

export const deleteLocation = (locationId) => {
    return axios.delete(`${API_URL}/delete/${locationId}`);
}