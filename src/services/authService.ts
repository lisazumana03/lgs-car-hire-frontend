/**
 * Car Type Service
 * Imtiyaaz Waggie 219374759
 * Added Auth
 * Converted to TypeScript
 */

import axios, { AxiosResponse } from 'axios';
import type { LoginRequest, SignupRequest, AuthResponse, UserData } from '../types';

const API_URL = 'http://localhost:3045/api/auth';

// Token management
export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('authToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Initialize token on app load - only if valid
const token = getAuthToken();
if (token && token !== 'null' && token !== 'undefined') {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else if (token) {
  // Clear invalid token
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
}

// Add axios interceptor to handle 401 errors (expired/invalid tokens)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, clear it
      setAuthToken(null);
      clearUserData();
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User data management
export const setUserData = (userData: UserData): void => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

export const getUserData = (): UserData | null => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

export const clearUserData = (): void => {
  localStorage.removeItem('userData');
};

// Login user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    const { token, userId, email: userEmail, name, role } = response.data;

    // Store token and user data
    setAuthToken(token);
    setUserData({ userId, email: userEmail, name, role });

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Sign up user
export const signup = async (userData: SignupRequest): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(`${API_URL}/signup`, userData);

    const { token, userId, email, name, role } = response.data;

    // Store token and user data
    setAuthToken(token);
    setUserData({ userId, email, name, role });

    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Sign up admin
export const signupAdmin = async (userData: SignupRequest): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(`${API_URL}/signup/admin`, userData);

    const { token, userId, email, name, role } = response.data;

    // Store token and user data
    setAuthToken(token);
    setUserData({ userId, email, name, role });

    return response.data;
  } catch (error) {
    console.error('Admin signup error:', error);
    throw error;
  }
};

// Logout user
export const logout = (): void => {
  setAuthToken(null);
  clearUserData();
};

// Get current user info
export const getCurrentUser = (): UserData | null => {
  return getUserData();
};
