const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3045/api';

export const API_ENDPOINTS = {
  BASE: BASE_URL,

  AUTH: {
    LOGIN: `${BASE_URL}/users/login`,
    REGISTER: `${BASE_URL}/users/signup`,
    LOGOUT: `${BASE_URL}/users/logout`,
    PROFILE: `${BASE_URL}/users`,
    UPDATE_PROFILE: `${BASE_URL}/users`,
  },

  BOOKING: {
    BASE: `${BASE_URL}/booking`,
    CREATE: `${BASE_URL}/booking/create`,
    READ: (id) => `${BASE_URL}/booking/read/${id}`,
    UPDATE: `${BASE_URL}/booking/update`,
    DELETE: (id) => `${BASE_URL}/booking/delete/${id}`,
    LIST: `${BASE_URL}/booking/getall`,
    BY_USER: (userId) => `${BASE_URL}/booking/user/${userId}`,
  },

  CAR: {
    BASE: `${BASE_URL}/car`,
    CREATE: `${BASE_URL}/car/create`,
    READ: (id) => `${BASE_URL}/car/read/${id}`,
    UPDATE: `${BASE_URL}/car/update`,
    DELETE: (id) => `${BASE_URL}/car/delete/${id}`,
    LIST: `${BASE_URL}/car/getall`,
    FILTER_BY_BRAND: (brand) => `${BASE_URL}/car/brand/${brand}`,
    FILTER_BY_YEAR: (year) => `${BASE_URL}/car/year/${year}`,
    FILTER_BY_PRICE: (minPrice, maxPrice) => `${BASE_URL}/car/price/${minPrice}/${maxPrice}`,
    AVAILABLE: `${BASE_URL}/car/available`,
  },

  CAR_TYPE: {
    BASE: `${BASE_URL}/cartype`,
    CREATE: `${BASE_URL}/cartype/create`,
    READ: (id) => `${BASE_URL}/cartype/read/${id}`,
    UPDATE: `${BASE_URL}/cartype/update`,
    DELETE: (id) => `${BASE_URL}/cartype/delete/${id}`,
    LIST: `${BASE_URL}/cartype/getall`,
  },

  INSURANCE: {
    BASE: `${BASE_URL}/insurance`,
    CREATE: `${BASE_URL}/insurance/create`,
    READ: (id) => `${BASE_URL}/insurance/read/${id}`,
    UPDATE: `${BASE_URL}/insurance/update`,
    DELETE: (id) => `${BASE_URL}/insurance/delete/${id}`,
    LIST: `${BASE_URL}/insurance/getall`,
  },

  INVOICE: {
    BASE: `${BASE_URL}/invoice`,
    CREATE: `${BASE_URL}/invoice/create`,
    READ: (id) => `${BASE_URL}/invoice/read/${id}`,
    UPDATE: `${BASE_URL}/invoice/update`,
    DELETE: (id) => `${BASE_URL}/invoice/delete/${id}`,
    LIST: `${BASE_URL}/invoice/getall`,
    BY_BOOKING: (bookingId) => `${BASE_URL}/invoice/booking/${bookingId}`,
  },

  LOCATION: {
    BASE: `${BASE_URL}/location`,
    CREATE: `${BASE_URL}/location/create`,
    READ: (id) => `${BASE_URL}/location/read/${id}`,
    UPDATE: `${BASE_URL}/location/update`,
    DELETE: (id) => `${BASE_URL}/location/delete/${id}`,
    LIST: `${BASE_URL}/location/getall`,
  },

  MAINTENANCE: {
    BASE: `${BASE_URL}/maintenance`,
    CREATE: `${BASE_URL}/maintenance/create`,
    READ: (id) => `${BASE_URL}/maintenance/read/${id}`,
    UPDATE: `${BASE_URL}/maintenance/update`,
    DELETE: (id) => `${BASE_URL}/maintenance/delete/${id}`,
    LIST: `${BASE_URL}/maintenance/getall`,
    BY_CAR: (carId) => `${BASE_URL}/maintenance/car/${carId}`,
  },

  PAYMENT: {
    BASE: `${BASE_URL}/payment`,
    CREATE: `${BASE_URL}/payment/create`,
    READ: (id) => `${BASE_URL}/payment/read/${id}`,
    UPDATE: `${BASE_URL}/payment/update`,
    DELETE: (id) => `${BASE_URL}/payment/delete/${id}`,
    LIST: `${BASE_URL}/payment/getall`,
    VERIFY: `${BASE_URL}/payment/verify`,
  },

  REVIEW: {
    BASE: `${BASE_URL}/review`,
    CREATE: `${BASE_URL}/review/create`,
    READ: (id) => `${BASE_URL}/review/read/${id}`,
    UPDATE: `${BASE_URL}/review/update`,
    DELETE: (id) => `${BASE_URL}/review/delete/${id}`,
    LIST: `${BASE_URL}/review/getall`,
    BY_CAR: (carId) => `${BASE_URL}/review/car/${carId}`,
  },

  SUPPORT: {
    BASE: `${BASE_URL}/support`,
    CREATE: `${BASE_URL}/support/create`,
    READ: (id) => `${BASE_URL}/support/read/${id}`,
    UPDATE: `${BASE_URL}/support/update`,
    DELETE: (id) => `${BASE_URL}/support/delete/${id}`,
    LIST: `${BASE_URL}/support/getall`,
    BY_USER: (userId) => `${BASE_URL}/support/user/${userId}`,
  },

  NOTIFICATION: {
    BASE: `${BASE_URL}/notification`,
    CREATE: `${BASE_URL}/notification/create`,
    READ: (id) => `${BASE_URL}/notification/read/${id}`,
    UPDATE: `${BASE_URL}/notification/update`,
    DELETE: (id) => `${BASE_URL}/notification/delete/${id}`,
    LIST: `${BASE_URL}/notification/getall`,
    BY_USER: (userId) => `${BASE_URL}/notification/user/${userId}`,
    MARK_READ: (id) => `${BASE_URL}/notification/${id}/read`,
  },
};

export default API_ENDPOINTS;
