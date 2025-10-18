import axios from "axios";

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3045";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  idNumber: number;
  phoneNumber: string;
  dateOfBirth: string;
  licenseNumber: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupData {
  name: string;
  idNumber: number;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  licenseNumber: string;
  password: string;
  role?: "CUSTOMER" | "ADMIN";
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/api/users/login", { email, password });
    return response.data;
  },

  // Signup
  signup: async (userData: SignupData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/api/users/signup", userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/api/users/me");
    return response.data;
  },
};

export default api;
