// Admin API functions for administrative operations
const API_BASE_URL = 'http://localhost:3045/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}, response:`, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle 204 No Content responses (empty responses for DELETE operations)
        if (response.status === 204) {
            console.log('204 No Content response - operation successful');
            return { success: true, message: 'Operation completed successfully' };
        }

        // For other responses, try to parse JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            // If not JSON, return success
            console.log('Non-JSON response - operation successful');
            return { success: true, message: 'Operation completed successfully' };
        }

    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

// ==================== USERS ====================
const getAllUsers = async () => {
    return await apiCall('/users');
};

const getUserById = async (userId) => {
    return await apiCall(`/users/${userId}`);
};

const updateUser = async (userId, userData) => {
    return await apiCall(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
};

const deleteUser = async (userId) => {
    return await apiCall(`/users/${userId}`, {
        method: 'DELETE'
    });
};

// ==================== CARS ====================
const getAllCars = async () => {
    return await apiCall('/car/all');
};

const getCarById = async (carId) => {
    return await apiCall(`/car/read/${carId}`);
};

const createCar = async (carData) => {
    return await apiCall('/car/create', {
        method: 'POST',
        body: JSON.stringify(carData)
    });
};

const updateCar = async (carId, carData) => {
    return await apiCall('/car/update', {
        method: 'PUT',
        body: JSON.stringify({ ...carData, carID: carId })
    });
};

const updateCarAvailability = async (carId, available) => {
    return await apiCall(`/car/availability/${carId}?available=${available}`, {
        method: 'PUT'
    });
};

const deleteCar = async (carId) => {
    return await apiCall(`/car/delete/${carId}`, {
        method: 'DELETE'
    });
};

// ==================== LOCATIONS ====================
const getAllLocations = async () => {
    return await apiCall('/location/all');
};

const getLocationById = async (locationId) => {
    return await apiCall(`/location/read/${locationId}`);
};

const createLocation = async (locationData) => {
    return await apiCall('/location/create', {
        method: 'POST',
        body: JSON.stringify(locationData)
    });
};

const updateLocation = async (locationId, locationData) => {
    return await apiCall('/location/update', {
        method: 'PUT', // Your backend uses POST for update
        body: JSON.stringify({ ...locationData, locationID: locationId })
    });
};

const deleteLocation = async (locationId) => {
    return await apiCall(`/location/delete/${locationId}`, {
        method: 'DELETE'
    });
};

// ==================== BOOKINGS ====================
const getAllBookings = async () => {
    return await apiCall('/booking/all');
};

const updateBooking = async (bookingData) => {
    return await apiCall('/booking/update', {
        method: 'PUT',
        body: JSON.stringify(bookingData)
    });
};

const cancelBooking = async (bookingId) => {
    return await apiCall(`/booking/cancel/${bookingId}`, {
        method: 'DELETE'
    });
};

const deleteBooking = async (bookingId) => {
    return await apiCall(`/booking/delete/${bookingId}`, {
        method: 'DELETE'
    });
};

// ==================== PAYMENTS ====================
const getAllPayments = async () => {
    return await apiCall('/payment/all');
};

const getPaymentById = async (paymentId) => {
    return await apiCall(`/payment/read/${paymentId}`);
};

const updatePaymentStatus = async (paymentId, status) => {
    return await apiCall(`/payment/update-status/${paymentId}/${status}`, {
        method: 'PUT'
    });
};


// ==================== MAINTENANCE ====================
const getAllMaintenance = async () => {
    return await apiCall('/maintenance/all');
};

const getMaintenanceById = async (maintenanceId) => {
    return await apiCall(`/maintenance/read/${maintenanceId}`);
};

const createMaintenance = async (maintenanceData) => {
    return await apiCall('/maintenance/create', {
        method: 'POST',
        body: JSON.stringify(maintenanceData)
    });
};

const updateMaintenance = async (maintenanceId, maintenanceData) => {
    return await apiCall(`/maintenance/update/${maintenanceId}`, {
        method: 'PUT',
        body: JSON.stringify(maintenanceData)
    });
};

const deleteMaintenance = async (maintenanceId) => {
    return await apiCall(`/maintenance/delete/${maintenanceId}`, {
        method: 'DELETE'
    });
};

// ==================== INSURANCE ====================
const getAllInsurance = async () => {
    return await apiCall('/insurance');
};

const getInsuranceById = async (insuranceId) => {
    return await apiCall(`/insurance/${insuranceId}`);
};

const createInsurance = async (insuranceData) => {
    return await apiCall('/insurance', {
        method: 'POST',
        body: JSON.stringify(insuranceData)
    });
};

const updateInsurance = async (insuranceId, insuranceData) => {
    return await apiCall(`/insurance/${insuranceId}`, {
        method: 'PUT',
        body: JSON.stringify(insuranceData)
    });
};

const deleteInsurance = async (insuranceId) => {
    return await apiCall(`/insurance/${insuranceId}`, {
        method: 'DELETE'
    });
};

// ==================== SYSTEM OVERVIEW ====================
const getSystemOverview = async () => {
    // This would aggregate data from multiple endpoints
    // For now, return mock data or implement later
    return {
        totalUsers: 0,
        totalCars: 0,
        availableCars: 0,
        totalBookings: 0,
        activeBookings: 0,
        totalRevenue: 0
    };
};

// Export all functions
export const adminApi = {
    // Users
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,

    // Cars
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    updateCarAvailability,
    deleteCar,

    // Locations
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,

    // Bookings
    getAllBookings,
    updateBooking,
    cancelBooking,
    deleteBooking,

    // Payments
    getAllPayments,
    getPaymentById,
    updatePaymentStatus,

    // Maintenance
    getAllMaintenance,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,

    // Insurance
    getAllInsurance,
    getInsuranceById,
    createInsurance,
    updateInsurance,
    deleteInsurance,

    // System
    getSystemOverview
};