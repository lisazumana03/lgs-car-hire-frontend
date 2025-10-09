/*
Notification Service
Handles notification operations with JWT authentication
*/

import axios from "axios";
import { getAuthToken } from "./authService.js";

const API_URL = "http://localhost:3045/api/notifications";

// Helper to add auth header
const getConfig = () => {
  const token = getAuthToken();
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

// Get all notifications
export const getAllNotifications = () => {
  return axios.get(`${API_URL}`, getConfig());
};

// Get notification by ID
export const getNotificationById = (id) => {
  return axios.get(`${API_URL}/${id}`, getConfig());
};

// Create notification
export const createNotification = (notificationData) => {
  return axios.post(`${API_URL}`, notificationData, getConfig());
};

// Update notification
export const updateNotification = (id, notificationData) => {
  return axios.put(`${API_URL}/${id}`, notificationData, getConfig());
};

// Delete notification
export const deleteNotification = (id) => {
  return axios.delete(`${API_URL}/${id}`, getConfig());
};
