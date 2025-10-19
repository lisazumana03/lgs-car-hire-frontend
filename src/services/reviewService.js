import apiClient from "../scripts/apiConfig";

// Use relative paths - apiClient already has baseURL: http://localhost:3045/api

export const create = (review) => {
  return apiClient.post("/review/create", review);
};

export const getAllTickects = () => {
  return apiClient.get("/review/all");
};

// Correct spelling alias
export const getAllReviews = () => {
  return apiClient.get("/review/all");
};

export const updateReview = (review) => {
  return apiClient.put("/review/update", review);
};

export const updateSupportTicket = (review) => {
  return apiClient.put("/review/update", review);
};

export const deleteReview = (reviewID) => {
  return apiClient.delete(`/review/delete/${reviewID}`);
};

export const deleteSupportTicket = (reviewID) => {
  return apiClient.delete(`/review/delete/${reviewID}`);
};

export const cancelSupportTicket = (reviewID) => {
  return apiClient.delete(`/review/delete/${reviewID}`);
};
