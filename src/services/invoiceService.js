/**
 * Sanele Zondi (221602011)
 * invoiceService.js
 */

import axios from "axios";

const API_URL = "http://localhost:3045/api";


const invoiceService = {
    create: async (invoiceData) => {
        try {
            const response = await axios.post(`${API_URL}/invoice/create`, invoiceData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Invoice creation failed');
        }
    },

    read: async (invoiceId) => {
        try {
            const response = await axios.get(`${API_URL}/invoice/read/${invoiceId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch invoice');
        }
    },

    update: async (invoiceData) => {
        try {
            const response = await axios.put(`${API_URL}/invoice/update`, invoiceData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update invoice');
        }
    },

    delete: async (invoiceId) => {
        try {
            const response = await axios.delete(`${API_URL}/invoice/delete/${invoiceId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete invoice');
        }
    },

    getUserInvoices: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/invoices/user/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user invoices');
        }
    }
};

export default invoiceService;