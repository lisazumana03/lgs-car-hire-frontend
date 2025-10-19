import axios from "axios";
import apiClient, { API_BASE_URL } from "./apiConfig.js";

// User Authentication API Functions

export async function loginUser(email, password) {
  try {
    // Send only email and password - backend determines role from database
    const loginData = {
      email: email,
      password: password,
    };

    console.log("Sending login data:", loginData);

    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);

    // Backend returns: { token, user, tokenType }
    // User object includes the role from database
    console.log("Login response:", response.data);
    return response.data; // Return full response with token
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error response:", error.response);
    throw new Error(
      error.response?.data?.message || "Invalid email or password"
    );
  }
}

export async function registerUser(userData) {
  try {
    console.log("Sending registration data:", userData);
    console.log("API URL:", `${API_BASE_URL}/auth/register`);

    // Match SignUpRequestDTO - use /auth/register endpoint
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData
    );

    // Backend returns: { token, user, tokenType }
    console.log("Registration response:", response.data);
    return response.data; // Return full response with token
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
    // Use apiClient which automatically includes JWT token
    const response = await apiClient.get(`/users/${userId}`);
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

    // Use apiClient which automatically includes JWT token
    const response = await apiClient.put(`/users/${userId}`, profileData);

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
