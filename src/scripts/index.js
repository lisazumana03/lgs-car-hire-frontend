import userService from '../services/userService.js';

export const registerUser = async (userData) => {
    try {
        const response = await userService.register(userData);
        console.log('Registration successful:', response);
        return response;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await userService.login(email, password);
        console.log('Login successful:', response);

        // Return the user data with role
        return {
            ...response.user,
            role: response.role,
            message: response.message
        };
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const profile = await userService.getProfile(userId);
        console.log('Profile fetched:', profile);
        return profile;
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (userId, userData) => {
    try {
        const updatedProfile = await userService.updateProfile(userId, userData);
        console.log('Profile updated:', updatedProfile);
        return updatedProfile;
    } catch (error) {
        console.error('Failed to update profile:', error);
        throw error;
    }
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const response = await userService.changePassword(userId, oldPassword, newPassword);
        console.log('Password changed successfully');
        return response;
    } catch (error) {
        console.error('Failed to change password:', error);
        throw error;
    }
};

export const logoutUser = () => {
    userService.logout();
    console.log('User logged out');
};

export const isAuthenticated = () => {
    return userService.isAuthenticated();
};

export const isCustomer = () => {
    return userService.isCustomer();
};

export const isAdmin = () => {
    return userService.isAdmin();
};

export const getCurrentUser = () => {
    return userService.getCurrentUser();
};

export const getUserRole = () => {
    return userService.getUserRole();
};

export const canUserRentCar = async (userId) => {
    try {
        const canRent = await userService.canRentCar(userId);
        return canRent;
    } catch (error) {
        console.error('Failed to check rental eligibility:', error);
        return false;
    }
};

export const adminFunctions = {
    getAllUsers: userService.admin.getAllUsers,
    getAllCustomers: userService.admin.getAllCustomers,
    getAllAdmins: userService.admin.getAllAdmins,
    promoteToAdmin: userService.admin.promoteToAdmin,
    demoteToCustomer: userService.admin.demoteToCustomer,
    deleteUser: userService.admin.deleteUser,
    getUserByEmail: userService.admin.getUserByEmail
};

export default {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    logoutUser,
    isAuthenticated,
    isCustomer,
    isAdmin,
    getCurrentUser,
    getUserRole,
    canUserRentCar,
    admin: adminFunctions
};