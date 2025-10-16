/*
Sibulele Nohamba
220374686
Date: 31/08/2025
 */
import axios from "axios";

const API_URL = "http://localhost:3046/api/insurance";

export const createInsurance = (insurance) => {
    return axios.post(`${API_URL}/create`, insurance);
}

export const readInsurance = (id) => {
    return axios.get(`${API_URL}/read/${id}`);
}

export const updateInsurance = (insurance) => {
    return axios.put(`${API_URL}/update`, insurance);
}

export const deleteInsurance = (id) => {
    return axios.delete(`${API_URL}/delete/${id}`);
}

export const cancelInsurance = (id) => {
    return axios.delete(`${API_URL}/cancel/${id}`);
}

export const getAllInsurance = () => {
    return axios.get(`${API_URL}/all`);
};

export const getInsuranceById = readInsurance;
