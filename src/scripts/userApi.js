import axios from "axios";
import { API_BASE_URL } from "./apiConfig.js";

// User Authentication API Functions using Axios

export async function loginUser(email, password, role) {
  try {
    // Match LoginRequestDTO structure - send as JSON
    const loginData = {
      email: email,
      password: password,
      role: role, // Must be 'ADMIN', 'CUSTOMER', or 'CAR_OWNER'
    };

    console.log("Sending login data:", loginData);

    const response = await axios.post(`${API_BASE_URL}/users/login`, loginData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error response:", error.response);
    throw new Error(
      error.response?.data?.message || "Invalid credentials or role"
    );
  }
}

export async function registerUser(userData) {
  try {
    console.log("Sending registration data:", userData);
    console.log("API URL:", `${API_BASE_URL}/users/register`);

    // Match SignUpRequestDTO - use /register endpoint
    const response = await axios.post(
      `${API_BASE_URL}/users/register`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error response:", error.response);
    console.error("Error response data:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
        error.response?.data ||
        "Registration failed"
    );
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
  // Logout is handled client-side (clear session/localStorage)
  // No backend call needed
  return true;
}

export default {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
};
