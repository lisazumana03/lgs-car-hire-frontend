/*
Imtiyaaz Waggie 219374759
 */


import axios from "axios";

const API_URL = "http://localhost:3045/api/users";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

const userService = {
    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    login: async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });

            if (response.data.user) {
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                localStorage.setItem('userRole', response.data.role);

                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                }
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    logout: () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        localStorage.removeItem('authToken');
    },

    getProfile: async (userId) => {
        try {
            const response = await api.get(`/profile/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateProfile: async (userId, userData) => {
        try {
            const response = await api.put(`/profile/${userId}`, userData);
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    changePassword: async (userId, oldPassword, newPassword) => {
        try {
            const response = await api.post(`/change-password/${userId}`, {
                oldPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    isCustomer: () => {
        const role = localStorage.getItem('userRole');
        return role === 'CUSTOMER' || role === 'customer';
    },

    isAdmin: () => {
        const role = localStorage.getItem('userRole');
        return role === 'ADMIN' || role === 'admin';
    },

    isAuthenticated: () => {
        return localStorage.getItem('currentUser') !== null;
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    getUserRole: () => {
        return localStorage.getItem('userRole');
    },

    canRentCar: async (userId) => {
        try {
            const response = await api.get(`/admin/can-rent/${userId}`);
            return response.data.canRent;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    admin: {
        getAllUsers: async () => {
            try {
                const response = await api.get('/admin/all');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        getAllCustomers: async () => {
            try {
                const response = await api.get('/admin/customers');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        getAllAdmins: async () => {
            try {
                const response = await api.get('/admin/admins');
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        promoteToAdmin: async (userId) => {
            try {
                const response = await api.put(`/admin/promote/${userId}`);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        demoteToCustomer: async (userId) => {
            try {
                const response = await api.put(`/admin/demote/${userId}`);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        deleteUser: async (userId) => {
            try {
                const response = await api.delete(`/admin/delete/${userId}`);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },

        getUserByEmail: async (email) => {
            try {
                const response = await api.get(`/admin/by-email/${email}`);
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        }
    }
};

export default userService;