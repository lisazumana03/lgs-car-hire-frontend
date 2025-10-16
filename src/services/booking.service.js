/*
Lisakhanya Zumana
230864821
 */
import axiosInstance from './api/axios.config';
import API_ENDPOINTS from './api/endpoints';

const bookingService = {
  /**
   * Create a new booking
   * @param {object} booking - Booking data
   * @returns {Promise<object>} Created booking
   */
  create: async (booking) => {
    try {
      console.log('Creating booking:', booking);
      const response = await axiosInstance.post(API_ENDPOINTS.BOOKING.CREATE, booking);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  /**
   * Get booking by ID
   * @param {string} id - Booking ID
   * @returns {Promise<object>} Booking data
   */
  read: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.BOOKING.READ(id));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  },

  /**
   * Update existing booking
   * @param {object} booking - Updated booking data
   * @returns {Promise<object>} Updated booking
   */
  update: async (booking) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.BOOKING.UPDATE, booking);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update booking');
    }
  },

  /**
   * Delete booking
   * @param {string} id - Booking ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (id) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.BOOKING.DELETE(id));
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete booking');
    }
  },

  /**
   * Cancel booking
   * @param {string} id - Booking ID
   * @returns {Promise<boolean>} Success status
   */
  cancel: async (id) => {
    try {
      await axiosInstance.delete(`${API_ENDPOINTS.BOOKING.BASE}/cancel/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  },

  /**
   * Get all bookings
   * @returns {Promise<array>} List of bookings
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.BOOKING.LIST);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  /**
   * Get bookings by user ID
   * @param {string} userId - User ID
   * @returns {Promise<array>} List of user's bookings
   */
  getByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.BOOKING.BY_USER(userId));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user bookings');
    }
  },

  getAllBookings: function() {
    return this.getAll();
  },

  updateBooking: function(booking) {
    return this.update(booking);
  },

  deleteBooking: function(id) {
    return this.delete(id);
  },

  cancelBooking: function(id) {
    return this.cancel(id);
  },
};

export default bookingService;

export const { create, read, update, cancel, getAll, getAllBookings, updateBooking, deleteBooking, cancelBooking } = bookingService;
