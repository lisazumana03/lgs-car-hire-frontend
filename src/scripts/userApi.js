import axios from "axios";
import { API_BASE_URL } from "./apiConfig.js";

// User Authentication API Functions using Axios

export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}

export async function getUserProfile(userId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
}

export async function updateUserProfile(userId, profileData) {
  try {
    console.log("Updating user profile...");
    console.log("User ID:", userId);
    console.log("Profile data being sent:", profileData);
    console.log("API URL:", `${API_BASE_URL}/users/${userId}`);

    const response = await axios.put(
      `${API_BASE_URL}/users/${userId}`,
      profileData
    );

    console.log("Profile update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    console.error("Error response data:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update profile"
    );
  }
}

export async function logoutUser() {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/logout`);
    return response.data || true;
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error(error.response?.data?.message || "Logout failed");
  }
}

export default {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
};
