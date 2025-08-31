import { API_BASE_URL, DEFAULT_HEADERS } from "./apiConfig.js";

const USE_MOCK = true; // set to false when backend is ready

// Mock users for demo
const mockUsers = [
  { id: 1, email: "admin@example.com", password: "admin123", role: "admin", name: "Admin User" },
  { id: 2, email: "user@example.com", password: "user123", role: "user", name: "Normal User" },
];

// User Authentication API Functions

export async function loginUser(email, password) {
// Mock login function
    if (USE_MOCK) {
      // Use mock users instead of backend
      return new Promise((resolve, reject) => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        setTimeout(() => {
          if (user) resolve({ ...user });
          else reject(new Error("Invalid email or password"));
        }, 500); // simulate API delay
      });
    }


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

    // Mock registration function
  if (USE_MOCK) {
    // Mock registration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, ...userData });
      }, 500);
    });
  }

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
    // Mock get profile function
  if (USE_MOCK) {
    // Mock profile
    const user = mockUsers.find(u => u.id === userId);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user) resolve({ ...user });
        else reject(new Error("User not found"));
      }, 500);
    });
  }

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

  // Mock update function
  if (USE_MOCK) {
    // Mock update
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex >= 0) {
          mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData };
          resolve({ ...mockUsers[userIndex] });
        } else reject(new Error("User not found"));
      }, 500);
    });
  }

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
    // Mock logout function
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(true), 300));
  }
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
