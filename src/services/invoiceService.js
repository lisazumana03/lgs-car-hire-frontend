/**
 * Sanele Zondi (221602011)
 * invoiceService.js
 */

import apiClient from "../scripts/apiConfig";

const API_URL = "http://localhost:3045/api";

const invoiceService = {
  create: async (invoiceData) => {
    try {
      const response = await apiClient.post(
        `${API_URL}/invoice/create`,
        invoiceData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Invoice creation failed"
      );
    }
  },

  read: async (invoiceId) => {
    try {
      const response = await apiClient.get(
        `${API_URL}/invoice/read/${invoiceId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch invoice"
      );
    }
  },

  update: async (invoiceData) => {
    try {
      const response = await apiClient.put(
        `${API_URL}/invoice/update`,
        invoiceData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update invoice"
      );
    }
  },

  delete: async (invoiceId) => {
    try {
      const response = await apiClient.delete(
        `${API_URL}/invoice/delete/${invoiceId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete invoice"
      );
    }
  },

  getUserInvoices: async (userId) => {
    try {
      console.log("InvoiceService: Getting invoices for user ID:", userId);
      console.log(
        "InvoiceService: API URL:",
        `${API_URL}/invoice/user/${userId}`
      );

      const response = await apiClient.get(`${API_URL}/invoice/user/${userId}`);
      console.log("InvoiceService: Response received:", response);
      console.log("InvoiceService: Response data:", response.data);

      return response.data;
    } catch (error) {
      console.error("InvoiceService: Error fetching user invoices:", error);
      console.error("InvoiceService: Error response:", error.response);
      console.error("InvoiceService: Error status:", error.response?.status);
      console.error("InvoiceService: Error data:", error.response?.data);

      throw new Error(
        error.response?.data?.message || "Failed to fetch user invoices"
      );
    }
  },

  getAllInvoices: async () => {
    try {
      console.log("InvoiceService: Getting all invoices...");
      console.log("InvoiceService: API URL:", `${API_URL}/invoice/all`);

      const response = await apiClient.get(`${API_URL}/invoice/all`);
      console.log("InvoiceService: All invoices response:", response);
      console.log("InvoiceService: All invoices data:", response.data);

      return response.data;
    } catch (error) {
      console.error("InvoiceService: Error fetching all invoices:", error);
      console.error("InvoiceService: Error response:", error.response);
      console.error("InvoiceService: Error status:", error.response?.status);
      console.error("InvoiceService: Error data:", error.response?.data);

      throw new Error(
        error.response?.data?.message || "Failed to fetch invoices"
      );
    }
  },

  getInvoicesByPayment: async (paymentId) => {
    try {
      const response = await apiClient.get(
        `${API_URL}/invoice/payment/${paymentId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch invoices by payment"
      );
    }
  },

  downloadInvoice: async (invoiceId) => {
    try {
      const response = await apiClient.get(
        `${API_URL}/invoice/download/${invoiceId}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to download invoice"
      );
    }
  },
};

export default invoiceService;
