/*
Lisakhanya Zumana (230864821)
Date: 14/08/2025
Invoice Service for managing invoice operations
*/
import apiClient from "../scripts/apiConfig";

const API_URL = "http://localhost:3045/api/invoice";

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

// Get all invoices
export const getAllInvoices = () => {
  console.log("Fetching all invoices");
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }
  return apiClient.get(`${API_URL}/all`);
};

// Get invoice by ID
export const getInvoiceById = (id) => {
  console.log("Fetching invoice with ID:", id);
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }
  return apiClient.get(`${API_URL}/read/${id}`);
};

// Create a new invoice
export const createInvoice = (invoiceData) => {
  console.log("Creating invoice:", invoiceData);
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }
  return apiClient.post(`${API_URL}/create`, invoiceData);
};

// Update an existing invoice
export const updateInvoice = (invoiceData) => {
  console.log("Updating invoice:", invoiceData);
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }
  return apiClient.put(`${API_URL}/update`, invoiceData);
};

// Delete an invoice
export const deleteInvoice = (id) => {
  console.log("Deleting invoice with ID:", id);
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }
  return apiClient.delete(`${API_URL}/delete/${id}`);
};

// Get invoices for a specific user
export const getUserInvoices = (userId) => {
  console.log("Fetching invoices for user ID:", userId);
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }
  return apiClient.get(`${API_URL}/user/${userId}`);
};

// Get invoices for a specific booking
export const getBookingInvoices = (bookingId) => {
  console.log("Fetching invoices for booking ID:", bookingId);
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }
  return apiClient.get(`${API_URL}/booking/${bookingId}`);
};
