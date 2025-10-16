// Export all API functions
export * from "./apiConfig.js";
export * from "./userApi.js";

// Re-export commonly used functions for convenience
export {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
} from "./userApi.js";
