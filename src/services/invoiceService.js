/**
 * Sanele Zondi (221602011)
 * invoiceService.js
 */

import axios from "axios";

const API_URL = "http://localhost:3045";

// Mock data for testing
const mockInvoices = [
    {
        invoiceID: "INV001",
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "PAID",
        subTotal: 2100,
        taxAmount: 315,
        totalAmount: 2415,
        booking: {
            bookingID: "BOOK001",
            startDate: "2024-01-15T08:00:00",
            endDate: "2024-01-20T17:00:00",
            pickupLocation: "Cape Town International Airport",
            user: {
                name: "John Doe",
                email: "admin@example.com"
            },
            cars: [
                {
                    model: "Toyota Corolla"
                }
            ]
        },
        payment: {
            paymentDate: new Date().toISOString()
        }
    },
    {
        invoiceID: "INV002",
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "PENDING",
        subTotal: 3400,
        taxAmount: 510,
        totalAmount: 3910,
        booking: {
            bookingID: "BOOK002",
            startDate: "2024-01-18T10:00:00",
            endDate: "2024-01-22T15:00:00",
            pickupLocation: "Cape Town City Center",
            user: {
                name: "Sarah Smith",
                email: "sarah.smith@email.com"
            },
            cars: [
                {
                    model: "BMW 3 Series"
                }
            ]
        }
    }
];

const invoiceService = {
    create: async (invoiceData) => {
        try {
            const response = await axios.post(`${API_URL}/invoice/create`, invoiceData);
            return response.data;
        } catch (error) {
            console.error('Invoice creation failed, using mock data');
            return mockInvoices[0];
        }
    },

    read: async (invoiceId) => {
        try {
            const response = await axios.get(`${API_URL}/invoice/read/${invoiceId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch invoice, using mock data');
            // Find mock invoice or return first one
            const mockInvoice = mockInvoices.find(inv => inv.invoiceID === invoiceId) || mockInvoices[0];
            return mockInvoice;
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
            console.error('Failed to fetch user invoices, now using mock data');
            return mockInvoices; // Return mock data for testing
        }
    }
};

export default invoiceService;