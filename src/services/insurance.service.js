/*
Sibulele Nohamba
220374686
Date: 31/08/2025
Updated: 2025-10-16 - Aligned with backend InsuranceController and InsuranceDTO
 */
import axiosInstance from './api/axios.config';
import API_ENDPOINTS from './api/endpoints';

const insuranceService = {
  /**
   * Create a new insurance
   * @param {object} insuranceDTO - Insurance data
   * @returns {Promise<object>} Created insurance
   */
  create: async (insuranceDTO) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.INSURANCE.BASE, insuranceDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create insurance');
    }
  },

  /**
   * Get insurance by ID
   * @param {number} id - Insurance ID
   * @returns {Promise<object>} Insurance data
   */
  read: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.INSURANCE.BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch insurance');
    }
  },

  /**
   * Update existing insurance
   * @param {number} id - Insurance ID
   * @param {object} insuranceDTO - Updated insurance data
   * @returns {Promise<object>} Updated insurance
   */
  update: async (id, insuranceDTO) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINTS.INSURANCE.BASE}/${id}`, insuranceDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update insurance');
    }
  },

  /**
   * Delete insurance
   * @param {number} id - Insurance ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    try {
      await axiosInstance.delete(`${API_ENDPOINTS.INSURANCE.BASE}/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete insurance');
    }
  },

  /**
   * Get all insurances
   * @returns {Promise<array>} List of insurances
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.INSURANCE.BASE);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch insurances');
    }
  },
};

// Export named functions for backward compatibility
export const createInsurance = insuranceService.create;
export const readInsurance = insuranceService.read;
export const updateInsurance = insuranceService.update;
export const deleteInsurance = insuranceService.delete;
export const getAllInsurance = insuranceService.getAll;
export const getInsuranceById = insuranceService.read;

export default insuranceService;
