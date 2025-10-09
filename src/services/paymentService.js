/**
 * Sanele Zondi (221602011)
 * paymentService.js
 */

import axios from "axios";
import { getAuthToken } from "./authService.js";

const API_URL = "http://localhost:3045/api";

// Helper to add auth header
const getConfig = () => {
  const token = getAuthToken();
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

const paymentService = {
  // Verify payment with backend (after Paystack success)
  verify: async (reference, bookingId, amount) => {
    try {
      const response = await axios.post(`${API_URL}/payments/verify`, {
        reference,
        bookingId,
        amount,
        paymentMethod: "PAYSTACK",
      }, getConfig());
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Payment verification failed"
      );
    }
  },

  read: async (paymentId) => {
    try {
      const response = await axios.get(`${API_URL}/payments/${paymentId}`, getConfig());
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payment"
      );
    }
  },

  update: async (paymentData) => {
    try {
      const response = await axios.put(
        `${API_URL}/payments/update`,
        paymentData,
        getConfig()
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update payment"
      );
    }
  },

  delete: async (paymentId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/payments/delete/${paymentId}`,
        getConfig()
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete payment"
      );
    }
  },

  getUserPayments: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/payments/user/${userId}`, getConfig());
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user payments"
      );
    }
  },
};

export default paymentService;
