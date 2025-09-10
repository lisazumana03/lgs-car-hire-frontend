import { API_BASE_URL, DEFAULT_HEADERS } from "./apiConfig.js";

// User Authentication API Functions

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function getUserProfile(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
}

export async function updateUserProfile(userId, profileData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/logout`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Logout failed");
    }

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}
