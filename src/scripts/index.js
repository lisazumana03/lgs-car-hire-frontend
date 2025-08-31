// Export all API functions
export * from "./apiConfig.js";
export * from "./userApi.js";
export * from "./notificationApi.js";

// Re-export commonly used functions for convenience
export {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
} from "./userApi.js";

export {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from "./notificationApi.js";
