/**
 * Sanele Zondi (221602011)
 * invoiceService.js
 */

import api from '../scripts/apiConfig';

const paymentService = {
    create: async (paymentData) => {
        try {
            const response = await api.post('/payment/create', paymentData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Payment processing failed');
        }
    },

    read: async (paymentId) => {
        try {
            const response = await api.get(`/payment/read/${paymentId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch payment');
        }
    },

    update: async (paymentData) => {
        try {
            const response = await api.put('/payment/update', paymentData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update payment');
        }
    },

    delete: async (paymentId) => {
        try {
            const response = await api.delete(`/payment/delete/${paymentId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete payment');
        }
    },

    getUserPayments: async (userId) => {
        try {
            const response = await api.get(`/payments/user/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch payments');
        }
    }
};

export default paymentService;