import axios from "axios";

const API_URL = "http://localhost:3045/support";

export const create = (support) => {
    return axios.post(`${API_URL}/create`, support);
}

export const getAllTickects = () => {
    return axios.get(API_URL);
}

export const updateSupportTicket = (support) => {
    return axios.put(`${API_URL}`, support);
}

export const deleteSupportTicket = (supportId) => {
    return axios.delete(`${API_URL}/${supportId}`);
}

export const cancelSupportTicket = (supportId) => {
    return axios.delete(`${API_URL}/${supportId}`);
}