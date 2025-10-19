/*
Lisakhanya Zumana (230864821)
Date: 14/08/2025
 */

import apiClient from "../scripts/apiConfig";

const API_URL = "http://localhost:3045/api/booking";

// Create a new booking
export const create = (booking) => {
  console.log("Creating booking:", booking);
  return apiClient.post(`${API_URL}/create`, booking, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Read a specific booking by ID
export const read = (id) => {
  return apiClient.get(`${API_URL}/read/${id}`);
};

// Update an existing booking
export const update = (booking) => {
  return apiClient.put(`${API_URL}/update`, booking);
};

// Delete a booking by ID
export const deleteBooking = (id) => {
  return apiClient.delete(`${API_URL}/delete/${id}`);
};

// Cancel a booking by ID
export const cancel = (id) => {
  return apiClient.delete(`${API_URL}/cancel/${id}`);
};

// Legacy function for backward compatibility
export const getAllBookings = () => {
  return apiClient.get(`${API_URL}/all`);
};

// Legacy function for backward compatibility
export const updateBooking = (booking) => {
  return update(booking);
};

// Legacy function for backward compatibility
export const cancelBooking = (id) => {
  return cancel(id);
};
