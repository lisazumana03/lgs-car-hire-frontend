import axios from "axios";

const API_URL = "http://localhost:3045/support";

export const create = (support) => axios.post(`${API_URL}/create`, support);

export const getAllTickects = () => axios.get(API_URL);

export const updateSupportTicket = (support) => axios.put(`${API_URL}`, support);

export const deleteSupportTicket = (supportId) => axios.delete(`${API_URL}/${supportId}`);

export const cancelSupportTicket = (supportId) => axios.delete(`${API_URL}/${supportId}`);