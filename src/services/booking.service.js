/*
Lisakhanya Zumana
230864821
Updated: 2025-10-16 - Aligned with backend Booking entity structure
 */
import axiosInstance from './api/axios.config';
import API_ENDPOINTS from './api/endpoints';

/**
 * Booking status enum matching backend
 */
export const BookingStatus = {
  CANCELLED: 'CANCELLED',
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
  DECLINED: 'DECLINED',
  BOOKED: 'BOOKED'
};

const bookingService = {
  /**
   * Create a new booking
   * @param {object} booking - Booking data with structure matching backend Booking entity
   * @returns {Promise<object>} Created booking
   */
  create: async (booking) => {
    try {
      console.log('Creating booking:', booking);
      const response = await axiosInstance.post(API_ENDPOINTS.BOOKING.CREATE, booking);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data || error.message || 'Failed to create booking';
      throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
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
      const response = await axiosInstance.get(`${API_ENDPOINTS.BOOKING.BASE}/all`);
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

  /**
   * Calculate rental days between two dates
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {number} Number of rental days
   */
  calculateRentalDays: (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(1, daysDiff);
  },

  /**
   * Calculate booking totals
   * @param {number} dailyRate - Daily rental rate
   * @param {number} rentalDays - Number of rental days
   * @param {number} insuranceCost - Insurance cost (optional)
   * @returns {object} Calculated totals with subtotal, tax, and total
   */
  calculateBookingTotals: (dailyRate, rentalDays, insuranceCost = 0) => {
    const subtotal = dailyRate * rentalDays + insuranceCost;
    const taxRate = 0.15; // 15% VAT
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    return {
      rentalDays,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      discountAmount: 0,
      totalAmount: Math.round(totalAmount * 100) / 100,
      currency: 'ZAR'
    };
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

export const {
  create,
  read,
  update,
  cancel,
  getAll,
  getAllBookings,
  updateBooking,
  deleteBooking,
  cancelBooking,
  calculateRentalDays,
  calculateBookingTotals
} = bookingService;
