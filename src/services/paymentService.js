/**
 * Sanele Zondi (221602011)
 * invoiceService.js
 */

import axios from "axios";

const API_URL = "http://localhost:3045";

const paymentService = {
    create: async (paymentData) => {
        try {
            const response = await axios.post(`${API_URL}/payment/create`, paymentData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Payment processing failed');
        }
    },

    read: async (paymentId) => {
        try {
            const response = await axios.get(`${API_URL}/payment/read/${paymentId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch payment');
        }
    },

    update: async (paymentData) => {
        try {
            const response = await axios.put(`${API_URL}/payment/update`, paymentData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update payment');
        }
    },

    delete: async (paymentId) => {
        try {
            const response = await axios.delete(`${API_URL}/payment/delete/${paymentId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete payment');
        }
    },

    getUserPayments: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/payments/user/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch payments');
        }
    }
};

export default paymentService;