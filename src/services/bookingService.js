/*
Lisakhanya Zumana (230864821)
Date: 14/08/2025
Updated: 10/09/2025 - Added JWT support
 */

import axios from "axios";
import { getAuthToken } from "./authService.js";

const API_URL = "http://localhost:3045/api/booking";

const getConfig = () => {
  const token = getAuthToken();
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    : {
        headers: {
          "Content-Type": "application/json",
        },
      };
};

// Create a new booking
export const create = (booking) => {
  console.log("Creating booking:", booking);
  return axios.post(`${API_URL}/create`, booking, getConfig());
};

// Read a specific booking by ID
export const read = (id) => {
  return axios.get(`${API_URL}/read/${id}`, getConfig());
};

// Update an existing booking
export const update = (booking) => {
  return axios.put(`${API_URL}/update`, booking, getConfig());
};

// Delete a booking by ID
export const deleteBooking = (id) => {
  return axios.delete(`${API_URL}/delete/${id}`, getConfig());
};

// Cancel a booking by ID
export const cancel = (id) => {
  return axios.delete(`${API_URL}/cancel/${id}`, getConfig());
};

// Get all bookings
export const getAllBookings = () => {
  return axios.get(`${API_URL}/all`, getConfig());
};

// Legacy function for backward compatibility
export const updateBooking = (booking) => {
  return update(booking);
};

// Legacy function for backward compatibility
export const cancelBooking = (id) => {
  return cancel(id);
};
