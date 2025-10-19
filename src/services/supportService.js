import apiClient from "../scripts/apiConfig";

const API_URL = "http://localhost:3045/support";

export const create = (support) => apiClient.post("/support/create", support);

export const getAllTickects = () => apiClient.get("/support/all");

// Correct spelling alias
export const getAllTickets = () => apiClient.get("/support/all");

export const updateSupport = (support) =>
  apiClient.put("/support/update", support);

export const updateSupportTicket = (support) =>
  apiClient.put("/support/update", support);

export const deleteSupport = (supportId) =>
  apiClient.delete(`/support/delete/${supportId}`);

export const deleteSupportTicket = (supportId) =>
  apiClient.delete(`/support/delete/${supportId}`);

export const cancelSupportTicket = (supportId) =>
  apiClient.delete(`/support/delete/${supportId}`);
