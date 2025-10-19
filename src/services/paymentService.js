/**
 * Sanele Zondi (221602011)
 * paymentService.js
 */

import apiClient from "../scripts/apiConfig";

const API_URL = "http://localhost:3045";

const paymentService = {
  // Verify payment with backend (after Paystack success)
  verify: async (reference, bookingId, amount) => {
    try {
      const response = await apiClient.post(`${API_URL}/payment/verify`, {
        bookingId,
        amount,
        paymentMethod: "PAYSTACK",
        reference,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Payment verification failed"
      );
    }
  },

  read: async (paymentId) => {
    try {
      const response = await apiClient.get(`${API_URL}/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payment"
      );
    }
  },

  update: async (paymentData) => {
    try {
      const response = await apiClient.put(
        `${API_URL}/payments/update`,
        paymentData
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
      const response = await apiClient.delete(
        `${API_URL}/payments/delete/${paymentId}`
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
      const response = await apiClient.get(
        `${API_URL}/payments/user/${userId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user payments"
      );
    }
  },
};

export default paymentService;
