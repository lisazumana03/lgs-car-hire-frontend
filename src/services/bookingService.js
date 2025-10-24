/*
Lisakhanya Zumana (230864821)
Date: 14/08/2025
Updated to fix JWT token issues and 403 Forbidden errors
 */

import apiClient from "../scripts/apiConfig";

const API_URL = "http://localhost:3045/api/booking";

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

// Helper function to get JWT token
const getAuthToken = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token && isTokenExpired(token)) {
    console.warn("JWT token has expired");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    return null;
  }
  return token;
};

// Create a new booking
export const create = (booking) => {
  console.log("Creating booking:", booking);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.post(`${API_URL}/create`, booking);
};

// Read a specific booking by ID
export const read = (id) => {
  console.log("Reading booking with ID:", id);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.get(`${API_URL}/read/${id}`);
};

// Get detailed booking information by ID (alternative endpoint)
export const getBookingDetails = (id) => {
  console.log("Getting detailed booking with ID:", id);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.get(`${API_URL}/details/${id}`);
};

// Get bookings for a specific user
export const getUserBookings = (userId) => {
  console.log("Getting bookings for user ID:", userId);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.get(`${API_URL}/user/${userId}`);
};

// Update an existing booking
export const update = (booking) => {
  console.log("Updating booking:", booking);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.put(`${API_URL}/update`, booking);
};

// Delete a booking by ID
export const deleteBooking = (id) => {
  console.log("Deleting booking with ID:", id);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.delete(`${API_URL}/delete/${id}`);
};

// Cancel a booking by ID
export const cancel = (id) => {
  console.log("Cancelling booking with ID:", id);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.delete(`${API_URL}/cancel/${id}`);
};

// Get all bookings
export const getAllBookings = () => {
  console.log("Fetching all bookings");

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

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
