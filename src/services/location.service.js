/*
Lisakhanya Zumana
230864821
Updated: 2025-10-16 - Aligned with backend LocationController and LocationDTO
 */
import axiosInstance from './api/axios.config';
import API_ENDPOINTS from './api/endpoints';

const locationService = {
  /**
   * Create a new location
   * @param {object} locationDTO - Location data
   * @returns {Promise<object>} Created location
   */
  create: async (locationDTO) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOCATION.CREATE, locationDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create location');
    }
  },

  /**
   * Get location by ID
   * @param {number} id - Location ID
   * @returns {Promise<object>} Location data
   */
  read: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LOCATION.READ(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch location');
    }
  },

  /**
   * Update existing location
   * @param {object} locationDTO - Updated location data (must include locationID)
   * @returns {Promise<object>} Updated location
   */
  update: async (locationDTO) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOCATION.UPDATE, locationDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update location');
    }
  },

  /**
   * Delete location
   * @param {number} id - Location ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.LOCATION.DELETE(id));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete location');
    }
  },

  /**
   * Get all locations
   * @returns {Promise<array>} List of locations
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LOCATION.LIST);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch locations');
    }
  },
};

// Export named functions for backward compatibility
export const createLocation = locationService.create;
export const getAllLocations = locationService.getAll;
export const updateLocation = locationService.update;
export const deleteLocation = locationService.delete;
export const getLocationById = locationService.read;

export default locationService;