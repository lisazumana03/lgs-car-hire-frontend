/*
Notification Service
Handles all notification-related API calls
*/

import apiClient from "../scripts/apiConfig";
import paymentService from "./paymentService.js";

// Base API URL for notifications
const API_URL = "http://localhost:3045/api/notifications";

// Axios configuration without credentials (CORS issue fix)
const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function to get current user ID from session
const getCurrentUserId = () => {
  const userStr =
    sessionStorage.getItem("user") || localStorage.getItem("user");

  console.log("Checking session storage for user...");
  console.log("Session storage user:", sessionStorage.getItem("user"));
  console.log("Local storage user:", localStorage.getItem("user"));

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log("Parsed user object:", user);
      console.log("All user properties:", Object.keys(user));

      // Try multiple possible ID field names
      const userId =
        user.id || user.userID || user.userId || user.ID || user.user_id;
      console.log("User ID found:", userId);

      return userId;
    } catch (error) {
      console.error("Error parsing user from session:", error);
      return null;
    }
  }
  console.log("No user found in storage");
  return null;
};

// Create a general notification (for car owners to send to users)
export const createNotification = async (notificationData) => {
  try {
    console.log("Sending notification:", notificationData);
    console.log("API URL:", API_URL);
    const response = await apiClient.post(
      API_URL,
      notificationData,
      axiosConfig
    ); // Send POST request to create notification
    console.log("Notification created successfully:", response.data);
    return response.data; // Return the created notification data
  } catch (error) {
    console.error("Error creating notification:", error); // Log error for debugging
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
    throw error; // Re-throw error for handling by calling component
  }
};

// Create a payment notification for a user
export const createPaymentNotification = async (
  userId,
  bookingId,
  amount,
  status = "completed"
) => {
  try {
    console.log("Creating payment notification with params:", {
      userId,
      bookingId,
      amount,
      status,
    });

    const statusText = status ? status.toLowerCase() : "completed";
    const notificationData = {
      userId: userId, // User ID who will receive the notification
      message: `Payment of R${amount} for booking ${bookingId} has been ${statusText}`, // Notification message
    };

    console.log("Sending payment notification:", notificationData);
    const response = await apiClient.post(
      API_URL,
      notificationData,
      axiosConfig
    ); // Send POST request to create notification
    console.log("Payment notification created:", response.data);
    return response.data; // Return the created notification data
  } catch (error) {
    console.error("Error creating payment notification:", error); // Log error for debugging
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error; // Re-throw error for handling by calling component
  }
};

// Create a booking notification for a user
export const createBookingNotification = async (
  userId,
  bookingId,
  status = "confirmed"
) => {
  try {
    const statusText = status ? status.toLowerCase() : "confirmed";

    // Create a friendly message
    let message;
    if (statusText.includes("on its way")) {
      message = `🚗 Great news! Your booking #${bookingId} is ${statusText}`;
    } else {
      message = `Your booking #${bookingId} has been ${statusText}`;
    }

    const notificationData = {
      userId: userId, // User ID who will receive the notification
      message: message, // Notification message
    };

    console.log("Sending booking notification:", notificationData);

    const response = await apiClient.post(
      API_URL,
      notificationData,
      axiosConfig
    ); // Send POST request to create notification
    return response.data; // Return the created notification data
  } catch (error) {
    console.error("Error creating booking notification:", error); // Log error for debugging
    throw error; // Re-throw error for handling by calling component
  }
};

// Get all notifications for a specific user
export const getUserNotifications = async (userId) => {
  try {
    const response = await apiClient.get(
      `${API_URL}/user/${userId}`,
      axiosConfig
    ); // Send GET request to fetch user notifications
    return response.data; // Return the notifications data
  } catch (error) {
    console.error("Error fetching user notifications:", error); // Log error for debugging
    throw error; // Re-throw error for handling by calling component
  }
};

// Get notifications for the current logged-in user
export const getCurrentUserNotifications = async () => {
  try {
    const userId = getCurrentUserId(); // Get current user ID from session

    if (!userId) {
      throw new Error("No user session found. Please login first.");
    }

    console.log("Fetching notifications for user ID:", userId); // Debug log

    const response = await apiClient.get(
      `${API_URL}/user/${userId}`,
      axiosConfig
    ); // Send GET request to fetch user notifications
    return response.data; // Return the notifications data
  } catch (error) {
    console.error("Error fetching current user notifications:", error); // Log error for debugging
    throw error; // Re-throw error for handling by calling component
  }
};

// Get all notifications (admin function)
export const getAllNotifications = async () => {
  try {
    const response = await apiClient.get(API_URL, axiosConfig); // Send GET request to fetch all notifications
    return response.data; // Return all notifications data
  } catch (error) {
    console.error("Error fetching all notifications:", error); // Log error for debugging
    throw error; // Re-throw error for handling by calling component
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(
      `${API_URL}/${notificationId}/read`,
      {},
      axiosConfig
    ); // Send PUT request to mark as read
    return response.data; // Return updated notification data
  } catch (error) {
    console.error("Error marking notification as read:", error); // Log error for debugging
    throw error; // Re-throw error for handling by calling component
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await apiClient.delete(
      `${API_URL}/${notificationId}`,
      axiosConfig
    ); // Send DELETE request to remove notification
    return response.data; // Return deletion confirmation
  } catch (error) {
    console.error("Error deleting notification:", error); // Log error for debugging
    throw error; // Re-throw error for handling by calling component
  }
};

// Default export for the service
export default {
  createNotification, // Export general notification creation function
  createPaymentNotification, // Export payment notification function
  createBookingNotification, // Export booking notification function
  getUserNotifications, // Export get user notifications function
  getCurrentUserNotifications, // Export get current user notifications function
  getAllNotifications, // Export get all notifications function
  markNotificationAsRead, // Export mark as read function
  deleteNotification, // Export delete notification function
};


