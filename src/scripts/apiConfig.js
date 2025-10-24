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

// REQUEST INTERCEPTOR - Add JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";

    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        console.warn("JWT token has expired, clearing auth data");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenType");
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        // Redirect to login if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(new Error("Token expired. Please log in again."));
      }

      config.headers.Authorization = `${tokenType} ${token}`;
      console.log("JWT token added to request:", config.url);
    } else {
      console.warn("No JWT token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle token expiration and errors
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.config?.url,
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      console.warn("401 Unauthorized - Token expired or invalid");
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
      console.error("403 Forbidden - Access denied:", {
        url: error.config?.url,
        method: error.config?.method,
        userRole: JSON.parse(localStorage.getItem("user") || "{}")?.role,
        tokenPresent: !!localStorage.getItem("token"),
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
