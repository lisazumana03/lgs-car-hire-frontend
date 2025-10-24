/*
Lisakhanya Zumana (230864821)
Date: 14/08/2025
Updated to fix JWT token issues and add map location functions
 */
import apiClient from "../scripts/apiConfig";

const API_URL = "http://localhost:3045/api/location";

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

export const create = (location) => {
  console.log("Creating location:", location);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.post(`${API_URL}/create`, location);
};

export const getAllLocations = () => {
  console.log("Fetching all locations");

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.get(`${API_URL}/all`);
};

// Read a specific location by ID (original endpoint)
export const read = (id) => {
  console.log("Reading location with ID:", id);
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }
  return apiClient.get(`${API_URL}/read/${id}`);
};

// Read a specific location by ID with fallback logic (new endpoint)
export const readWithFallback = (id) => {
  console.log("Reading location with fallback for ID:", id);
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }
  return apiClient.get(`${API_URL}/read-with-fallback/${id}`);
};

export const getLocationByProvinceOrState = (provinceOrState) => {
  console.log("Fetching locations by province/state:", provinceOrState);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.get(`${API_URL}/province-or-state/${provinceOrState}`);
};

export const updateLocation = (location) => {
  console.log("Updating location:", location);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.put(`${API_URL}/update`, location);
};

export const deleteLocation = (locationId) => {
  console.log("Deleting location with ID:", locationId);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  return apiClient.delete(`${API_URL}/delete/${locationId}`);
};

// Use the new endpoint for map searches
export const createLocationFromMap = async (locationData) => {
  console.log("Creating location from map data:", locationData);

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  try {
    const response = await apiClient.post(
      "/api/location/create-from-map",
      locationData
    );
    console.log("Location created from map:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating location from map:", error);
    throw error;
  }
};

// Fix existing province mapping issues
export const fixProvinceMapping = async () => {
  console.log("Fixing province mapping issues");

  // Check token before making request
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(
      new Error("Authentication required. Please log in again.")
    );
  }

  try {
    const response = await apiClient.post(
      "/api/location/fix-province-mapping",
      {}
    );
    console.log("Province mapping fixed:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fixing province mapping:", error);
    throw error;
  }
};
