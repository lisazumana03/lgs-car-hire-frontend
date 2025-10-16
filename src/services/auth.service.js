import axiosInstance from './api/axios.config';
import API_ENDPOINTS from './api/endpoints';

const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} User data and token
   */
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Created user data
   */
  register: async (userData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  /**
   * Logout user
   * @returns {Promise<boolean>} Success status
   */
  logout: async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Return true anyway to clear local auth state
      return true;
    }
  },

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<object>} User profile data
   */
  getProfile: async (userId) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.AUTH.PROFILE}/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {object} profileData - Updated profile data
   * @returns {Promise<object>} Updated user data
   */
  updateProfile: async (userId, profileData) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.AUTH.UPDATE_PROFILE}/${userId}`,
        profileData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  /**
   * Verify authentication token
   * @returns {Promise<boolean>} Token validity
   */
  verifyToken: async () => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.AUTH.PROFILE}/verify`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
