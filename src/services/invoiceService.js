/**
 * Sanele Zondi (221602011)
 * invoiceService.js
 */

import api from '../scripts/apiConfig';

const invoiceService = {
    create: async (invoiceData) => {
        try {
            const response = await api.post('/invoice/create', invoiceData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Invoice creation failed');
        }
    },

    read: async (invoiceId) => {
        try {
            const response = await api.get(`/invoice/read/${invoiceId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch invoice');
        }
    },

    update: async (invoiceData) => {
        try {
            const response = await api.put('/invoice/update', invoiceData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update invoice');
        }
    },

    delete: async (invoiceId) => {
        try {
            const response = await api.delete(`/invoice/delete/${invoiceId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete invoice');
        }
    },

    getUserInvoices: async (userId) => {
        try {
            const response = await api.get(`/invoices/user/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch invoices');
        }
    }
};

export default invoiceService;