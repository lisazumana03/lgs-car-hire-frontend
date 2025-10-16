import axios from "axios";

const API_URL = "http://localhost:3045/api";

const paymentService = {
  verify: async (reference, bookingId, amount) => {
    try {
      const response = await axios.post(`${API_URL}/payments/verify`, {
        reference,
        bookingId,
        amount,
        paymentMethod: "PAYSTACK",
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
      const response = await axios.get(`${API_URL}/payments/${paymentId}`);
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
      const response = await axios.delete(
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
      const response = await axios.get(`${API_URL}/payments/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user payments"
      );
    }
  },
};

export default paymentService;
