import axios from "axios";

// API Configuration
export const API_BASE_URL = "http://localhost:3045/api";

// Common headers for API requests
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS,
});

// REQUEST INTERCEPTOR - Add JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";

    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle token expiration and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error("Access denied: You don't have permission for this action");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
